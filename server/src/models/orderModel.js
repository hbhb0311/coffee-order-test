import pool from '../config/database.js'

// 주문 생성
export const createOrder = async (orderData) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Order 테이블에 주문 정보 저장
    const orderQuery = `
      INSERT INTO "order" (ord_dt, ord_sts, tot_amt)
      VALUES (CURRENT_TIMESTAMP, 'received', $1)
      RETURNING ord_id, ord_dt, ord_sts, tot_amt
    `
    const orderResult = await client.query(orderQuery, [orderData.totalAmount])
    const orderId = orderResult.rows[0].ord_id

    // OrderStatusHistory에 초기 상태 이력 저장
    const historyQuery = `
      INSERT INTO order_status_history (ord_id, ord_sts)
      VALUES ($1, 'received')
      RETURNING ord_sts_hist_id
    `
    await client.query(historyQuery, [orderId])

    // OrderProduct와 OrderProductOption 저장
    for (const item of orderData.items) {
      // OrderProduct 저장
      const orderProductQuery = `
        INSERT INTO order_product (ord_id, prd_id, prd_cnt, unit_amt, subtot_amt)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ord_prd_id
      `
      const orderProductResult = await client.query(orderProductQuery, [
        orderId,
        item.prdId,
        item.prd_cnt,
        item.unitPrice,
        item.subtotal
      ])
      const ordPrdId = orderProductResult.rows[0].ord_prd_id

      // OrderProductOption 저장
      if (item.optionIds && item.optionIds.length > 0) {
        for (const optId of item.optionIds) {
          // 옵션 가격 조회
          const optQuery = 'SELECT opt_prc FROM option WHERE opt_id = $1'
          const optResult = await client.query(optQuery, [optId])
          const optPrice = optResult.rows[0]?.opt_prc || 0

          const orderProductOptionQuery = `
            INSERT INTO order_product_option (ord_prd_id, opt_id, opt_prc)
            VALUES ($1, $2, $3)
          `
          await client.query(orderProductOptionQuery, [ordPrdId, optId, optPrice])
        }
      }

      // 재고 감소
      const decreaseStockQuery = `
        UPDATE product 
        SET prd_stk = prd_stk - $1, updt_dt = CURRENT_TIMESTAMP
        WHERE prd_id = $2
      `
      await client.query(decreaseStockQuery, [item.prd_cnt, item.prdId])
    }

    await client.query('COMMIT')
    return orderResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// 주문 ID로 조회
export const getOrderById = async (orderId) => {
  const query = `
    SELECT 
      o.ord_id,
      o.ord_dt,
      o.ord_sts,
      o.tot_amt,
      COALESCE(
        json_agg(
          json_build_object(
            'ord_prd_id', op.ord_prd_id,
            'prd_id', op.prd_id,
            'prd_nm', p.prd_nm,
            'prd_cnt', op.prd_cnt,
            'unit_amt', op.unit_amt,
            'subtot_amt', op.subtot_amt,
            'options', COALESCE(opts.options, '[]'::json)
          )
        ) FILTER (WHERE op.ord_prd_id IS NOT NULL),
        '[]'::json
      ) as items
    FROM "order" o
    LEFT JOIN order_product op ON o.ord_id = op.ord_id
    LEFT JOIN product p ON op.prd_id = p.prd_id
    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'opt_id', oo.opt_id,
          'opt_nm', opt.opt_nm,
          'opt_prc', oo.opt_prc
        )
      ) as options
      FROM order_product_option oo
      JOIN option opt ON oo.opt_id = opt.opt_id
      WHERE oo.ord_prd_id = op.ord_prd_id
    ) opts ON true
    WHERE o.ord_id = $1
    GROUP BY o.ord_id, o.ord_dt, o.ord_sts, o.tot_amt
  `
  const result = await pool.query(query, [orderId])
  return result.rows[0] || null
}

// 주문 목록 조회
export const getOrders = async (status = null, limit = 50, offset = 0) => {
  let query = `
    SELECT 
      o.ord_id,
      o.ord_dt,
      o.ord_sts,
      o.tot_amt,
      COALESCE(
        json_agg(
          json_build_object(
            'prd_nm', p.prd_nm,
            'prd_cnt', op.prd_cnt,
            'options', COALESCE(opts.options, '[]'::json)
          )
        ) FILTER (WHERE op.ord_prd_id IS NOT NULL),
        '[]'::json
      ) as items
    FROM "order" o
    LEFT JOIN order_product op ON o.ord_id = op.ord_id
    LEFT JOIN product p ON op.prd_id = p.prd_id
    LEFT JOIN LATERAL (
      SELECT json_agg(opt.opt_nm) as options
      FROM order_product_option oo
      JOIN option opt ON oo.opt_id = opt.opt_id
      WHERE oo.ord_prd_id = op.ord_prd_id
    ) opts ON true
  `
  const params = []
  
  if (status) {
    query += ' WHERE o.ord_sts = $1'
    params.push(status)
  }
  
  query += ' GROUP BY o.ord_id, o.ord_dt, o.ord_sts, o.tot_amt'
  query += ' ORDER BY o.ord_dt DESC'
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  params.push(limit, offset)

  const result = await pool.query(query, params)
  
  // 전체 개수 조회
  let countQuery = 'SELECT COUNT(*) as total FROM "order"'
  const countParams = []
  if (status) {
    countQuery += ' WHERE ord_sts = $1'
    countParams.push(status)
  }
  const countResult = await pool.query(countQuery, countParams)
  const total = parseInt(countResult.rows[0].total)

  return {
    orders: result.rows,
    total,
    limit,
    offset
  }
}

// 주문 상태 변경
export const updateOrderStatus = async (orderId, newStatus) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 현재 주문 상태 확인
    const currentOrderQuery = 'SELECT ord_sts FROM "order" WHERE ord_id = $1'
    const currentOrderResult = await client.query(currentOrderQuery, [orderId])
    
    if (currentOrderResult.rows.length === 0) {
      throw new Error('주문을 찾을 수 없습니다.')
    }

    const currentStatus = currentOrderResult.rows[0].ord_sts

    // 상태 변경 검증
    if (currentStatus === 'completed') {
      throw new Error('제조 완료된 주문은 상태를 변경할 수 없습니다.')
    }

    const validTransitions = {
      'received': ['in_progress'],
      'in_progress': ['completed']
    }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error('유효하지 않은 상태 변경입니다.')
    }

    // Order 테이블 업데이트
    const updateQuery = `
      UPDATE "order" 
      SET ord_sts = $1, updt_dt = CURRENT_TIMESTAMP
      WHERE ord_id = $2
      RETURNING ord_id, ord_sts, updt_dt
    `
    const updateResult = await client.query(updateQuery, [newStatus, orderId])

    // OrderStatusHistory에 이력 추가
    const historyQuery = `
      INSERT INTO order_status_history (ord_id, ord_sts)
      VALUES ($1, $2)
      RETURNING ord_sts_hist_id
    `
    const historyResult = await client.query(historyQuery, [orderId, newStatus])

    await client.query('COMMIT')
    return {
      ...updateResult.rows[0],
      historyId: historyResult.rows[0].ord_sts_hist_id
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// 주문 상태 이력 조회
export const getOrderHistory = async (orderId) => {
  const orderQuery = 'SELECT ord_id, ord_sts FROM "order" WHERE ord_id = $1'
  const orderResult = await pool.query(orderQuery, [orderId])
  
  if (orderResult.rows.length === 0) {
    return null
  }

  const historyQuery = `
    SELECT 
      ord_sts_hist_id as id,
      ord_sts as status,
      crt_dt as "changedAt"
    FROM order_status_history
    WHERE ord_id = $1
    ORDER BY crt_dt ASC
  `
  const historyResult = await pool.query(historyQuery, [orderId])

  return {
    orderId: parseInt(orderId),
    currentStatus: orderResult.rows[0].ord_sts,
    history: historyResult.rows
  }
}

// 주문 통계 조회
export const getOrderStatistics = async () => {
  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE TRUE) as total,
      COUNT(*) FILTER (WHERE ord_sts = 'received') as received,
      COUNT(*) FILTER (WHERE ord_sts = 'in_progress') as "inProgress",
      COUNT(*) FILTER (WHERE ord_sts = 'completed') as completed
    FROM "order"
  `
  const result = await pool.query(query)
  return result.rows[0]
}


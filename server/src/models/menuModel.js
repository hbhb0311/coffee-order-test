import pool from '../config/database.js'

// 모든 메뉴 조회 (옵션 포함)
export const getAllMenus = async () => {
  const query = `
    SELECT 
      p.prd_id,
      p.prd_nm,
      p.prd_desc,
      p.prd_prc,
      p.prd_img,
      p.prd_stk,
      COALESCE(
        json_agg(
          json_build_object(
            'opt_id', o.opt_id,
            'opt_nm', o.opt_nm,
            'opt_prc', o.opt_prc
          )
        ) FILTER (WHERE o.opt_id IS NOT NULL),
        '[]'::json
      ) as options
    FROM product p
    LEFT JOIN product_option po ON p.prd_id = po.prd_id AND po.del_yn = 'N'
    LEFT JOIN option o ON po.opt_id = o.opt_id
    GROUP BY p.prd_id, p.prd_nm, p.prd_desc, p.prd_prc, p.prd_img, p.prd_stk
    ORDER BY p.prd_id
  `
  const result = await pool.query(query)
  return result.rows
}

// 메뉴 ID로 조회
export const getMenuById = async (prdId) => {
  const query = `
    SELECT 
      p.prd_id,
      p.prd_nm,
      p.prd_desc,
      p.prd_prc,
      p.prd_img,
      p.prd_stk,
      COALESCE(
        json_agg(
          json_build_object(
            'opt_id', o.opt_id,
            'opt_nm', o.opt_nm,
            'opt_prc', o.opt_prc
          )
        ) FILTER (WHERE o.opt_id IS NOT NULL),
        '[]'::json
      ) as options
    FROM product p
    LEFT JOIN product_option po ON p.prd_id = po.prd_id AND po.del_yn = 'N'
    LEFT JOIN option o ON po.opt_id = o.opt_id
    WHERE p.prd_id = $1
    GROUP BY p.prd_id, p.prd_nm, p.prd_desc, p.prd_prc, p.prd_img, p.prd_stk
  `
  const result = await pool.query(query, [prdId])
  return result.rows[0] || null
}

// 재고 수정
export const updateStock = async (prdId, stock) => {
  const query = `
    UPDATE product 
    SET prd_stk = $1, updt_dt = CURRENT_TIMESTAMP
    WHERE prd_id = $2
    RETURNING prd_id, prd_nm, prd_stk, updt_dt
  `
  const result = await pool.query(query, [stock, prdId])
  return result.rows[0]
}

// 재고 확인
export const checkStock = async (prdId) => {
  const query = 'SELECT prd_id, prd_nm, prd_stk FROM product WHERE prd_id = $1'
  const result = await pool.query(query, [prdId])
  return result.rows[0] || null
}

// 재고 감소
export const decreaseStock = async (prdId, quantity) => {
  const query = `
    UPDATE product 
    SET prd_stk = prd_stk - $1, updt_dt = CURRENT_TIMESTAMP
    WHERE prd_id = $2 AND prd_stk >= $1
    RETURNING prd_id, prd_nm, prd_stk
  `
  const result = await pool.query(query, [quantity, prdId])
  return result.rows[0] || null
}


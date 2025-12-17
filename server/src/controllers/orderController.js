import * as orderModel from '../models/orderModel.js'
import * as menuModel from '../models/menuModel.js'

// 주문 생성
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body

    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 필요합니다.',
        code: 'VALIDATION_ERROR'
      })
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: '총 금액이 올바르지 않습니다.',
        code: 'VALIDATION_ERROR'
      })
    }

    // 재고 검증
    for (const item of items) {
      const product = await menuModel.checkStock(item.prdId)
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `상품 ID ${item.prdId}를 찾을 수 없습니다.`,
          code: 'MENU_NOT_FOUND'
        })
      }

      if (product.prd_stk < item.prd_cnt) {
        return res.status(400).json({
          success: false,
          error: '재고가 없습니다.',
          code: 'INSUFFICIENT_STOCK',
          data: {
            productId: product.prd_id,
            productName: product.prd_nm,
            requestedQuantity: item.prd_cnt,
            availableStock: product.prd_stk
          }
        })
      }
    }

    // 주문 생성
    const order = await orderModel.createOrder({
      items,
      totalAmount
    })

    res.status(201).json({
      success: true,
      data: {
        orderId: order.ord_id,
        orderDate: order.ord_dt,
        status: order.ord_sts,
        totalAmount: order.tot_amt
      }
    })
  } catch (error) {
    console.error('주문 생성 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 처리 중 오류가 발생했습니다.',
      code: 'ORDER_PROCESSING_ERROR'
    })
  }
}

// 주문 ID로 조회
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderModel.getOrderById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.',
        code: 'ORDER_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      data: {
        orderId: order.ord_id,
        orderDate: order.ord_dt,
        status: order.ord_sts,
        totalAmount: order.tot_amt,
        items: order.items
      }
    })
  } catch (error) {
    console.error('주문 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 조회 중 오류가 발생했습니다.'
    })
  }
}

// 주문 목록 조회
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const result = await orderModel.getOrders(status, limit, offset)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('주문 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 목록 조회 중 오류가 발생했습니다.'
    })
  }
}

// 주문 상태 변경
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        error: '상태를 입력해주세요.',
        code: 'VALIDATION_ERROR'
      })
    }

    const validStatuses = ['received', 'in_progress', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 상태입니다.',
        code: 'INVALID_STATUS'
      })
    }

    const result = await orderModel.updateOrderStatus(orderId, status)

    res.json({
      success: true,
      data: {
        orderId: result.ord_id,
        status: result.ord_sts,
        updatedAt: result.updt_dt,
        historyId: result.historyId
      }
    })
  } catch (error) {
    console.error('주문 상태 변경 오류:', error)
    
    if (error.message === '주문을 찾을 수 없습니다.') {
      return res.status(404).json({
        success: false,
        error: error.message,
        code: 'ORDER_NOT_FOUND'
      })
    }

    if (error.message.includes('유효하지 않은') || error.message.includes('변경할 수 없습니다')) {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'INVALID_STATUS'
      })
    }

    res.status(500).json({
      success: false,
      error: '주문 상태 변경 중 오류가 발생했습니다.'
    })
  }
}

// 주문 상태 이력 조회
export const getOrderHistory = async (req, res) => {
  try {
    const { orderId } = req.params
    const history = await orderModel.getOrderHistory(orderId)

    if (!history) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.',
        code: 'ORDER_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      data: history
    })
  } catch (error) {
    console.error('주문 이력 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 이력 조회 중 오류가 발생했습니다.'
    })
  }
}

// 주문 통계 조회
export const getOrderStatistics = async (req, res) => {
  try {
    const statistics = await orderModel.getOrderStatistics()
    res.json({
      success: true,
      data: {
        total: parseInt(statistics.total),
        received: parseInt(statistics.received),
        inProgress: parseInt(statistics.inProgress),
        completed: parseInt(statistics.completed)
      }
    })
  } catch (error) {
    console.error('주문 통계 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 통계 조회 중 오류가 발생했습니다.'
    })
  }
}


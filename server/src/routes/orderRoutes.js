import express from 'express'
import * as orderController from '../controllers/orderController.js'

const router = express.Router()

// GET /api/orders/statistics - 주문 통계 조회
router.get('/statistics', orderController.getOrderStatistics)

// GET /api/orders - 주문 목록 조회
router.get('/', orderController.getOrders)

// GET /api/orders/:orderId - 주문 정보 조회
router.get('/:orderId', orderController.getOrderById)

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder)

// PATCH /api/orders/:orderId/status - 주문 상태 변경
router.patch('/:orderId/status', orderController.updateOrderStatus)

// GET /api/orders/:orderId/history - 주문 상태 이력 조회
router.get('/:orderId/history', orderController.getOrderHistory)

export default router


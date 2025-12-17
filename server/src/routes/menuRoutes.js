import express from 'express'
import * as menuController from '../controllers/menuController.js'

const router = express.Router()

// GET /api/menus - 메뉴 목록 조회
router.get('/', menuController.getAllMenus)

// PATCH /api/menus/:menuId/stock - 재고 수정
router.patch('/:menuId/stock', menuController.updateStock)

export default router


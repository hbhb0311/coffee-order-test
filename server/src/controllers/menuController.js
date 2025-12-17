import * as menuModel from '../models/menuModel.js'

// 모든 메뉴 조회
export const getAllMenus = async (req, res) => {
  try {
    const menus = await menuModel.getAllMenus()
    res.json({
      success: true,
      data: menus
    })
  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '메뉴 목록을 불러오는데 실패했습니다.'
    })
  }
}

// 재고 수정
export const updateStock = async (req, res) => {
  try {
    const { menuId } = req.params
    const { stock } = req.body

    // 입력 검증
    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        error: '재고 수량을 입력해주세요.'
      })
    }

    const stockNum = parseInt(stock)
    if (isNaN(stockNum) || stockNum < 0 || stockNum > 999) {
      return res.status(400).json({
        success: false,
        error: '재고 수량은 0 이상 999 이하여야 합니다.',
        code: 'INVALID_STOCK_VALUE'
      })
    }

    const result = await menuModel.updateStock(menuId, stockNum)
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.',
        code: 'MENU_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      data: {
        prdId: result.prd_id,
        stock: result.prd_stk,
        updatedAt: result.updt_dt
      }
    })
  } catch (error) {
    console.error('재고 수정 오류:', error)
    res.status(500).json({
      success: false,
      error: '재고 수정 중 오류가 발생했습니다.'
    })
  }
}


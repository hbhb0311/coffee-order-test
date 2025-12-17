const API_BASE_URL = 'http://localhost:3001/api'

// 공통 fetch 함수
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API 요청 실패')
    }

    return data
  } catch (error) {
    console.error('API 요청 오류:', error)
    throw error
  }
}

// 메뉴 API
export const menuAPI = {
  // 모든 메뉴 조회
  getAllMenus: () => fetchAPI('/menus'),

  // 재고 수정
  updateStock: (menuId, stock) => 
    fetchAPI(`/menus/${menuId}/stock`, {
      method: 'PATCH',
      body: { stock }
    })
}

// 주문 API
export const orderAPI = {
  // 주문 생성
  createOrder: (orderData) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: orderData
    }),

  // 주문 ID로 조회
  getOrderById: (orderId) => fetchAPI(`/orders/${orderId}`),

  // 주문 목록 조회
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return fetchAPI(`/orders${queryString ? `?${queryString}` : ''}`)
  },

  // 주문 상태 변경
  updateOrderStatus: (orderId, status) =>
    fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status }
    }),

  // 주문 상태 이력 조회
  getOrderHistory: (orderId) => fetchAPI(`/orders/${orderId}/history`),

  // 주문 통계 조회
  getOrderStatistics: () => fetchAPI('/orders/statistics')
}


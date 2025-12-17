// 환경 변수에서 API URL 가져오기 (개발: .env 파일, 프로덕션: Render 환경 변수)
// VITE_API_URL에는 백엔드 기본 URL만 포함 (예: https://order-app-api.onrender.com)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_BASE_URL = `${BACKEND_URL}/api`

// 디버깅용 로그 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL)
}

// 공통 fetch 함수
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // 디버깅: 요청 URL 출력 (프로덕션에서도 확인 가능)
  console.log('API 요청 URL:', url)
  console.log('백엔드 URL:', BACKEND_URL)
  console.log('VITE_API_URL 환경 변수:', import.meta.env.VITE_API_URL)
  
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API 요청 오류:', error)
    console.error('요청했던 URL:', url)
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


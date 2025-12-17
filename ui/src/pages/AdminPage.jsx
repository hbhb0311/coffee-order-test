import { useState, useEffect } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'
import { menuAPI, orderAPI } from '../utils/api'
import './AdminPage.css'

function AdminPage({ orders, inventory, onUpdateInventory, onUpdateOrderStatus }) {
  const [statusFilter, setStatusFilter] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [orderList, setOrderList] = useState([])
  const [statistics, setStatistics] = useState({
    total: 0,
    received: 0,
    inProgress: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)

  // 메뉴 및 주문 목록 로드
  useEffect(() => {
    loadData()
    // 주기적으로 데이터 갱신 (5초마다)
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [statusFilter])

  const loadData = async () => {
    try {
      // 메뉴 목록 로드
      const menuResponse = await menuAPI.getAllMenus()
      if (menuResponse.success) {
        const formattedMenus = menuResponse.data.map(menu => ({
          id: menu.prd_id,
          name: menu.prd_nm,
          stock: menu.prd_stk
        }))
        setMenuItems(formattedMenus)
        
        // 재고 정보 업데이트
        formattedMenus.forEach(menu => {
          onUpdateInventory(menu.id, menu.stock)
        })
      }

      // 주문 목록 로드
      const orderParams = statusFilter ? { status: statusFilter } : {}
      const orderResponse = await orderAPI.getOrders(orderParams)
      if (orderResponse.success) {
        const formattedOrders = orderResponse.data.orders.map(order => ({
          id: order.ord_id,
          createdAt: new Date(order.ord_dt),
          status: order.ord_sts,
          totalAmount: order.tot_amt,
          items: order.items.map(item => ({
            menuName: item.prd_nm,
            quantity: item.prd_cnt,
            options: item.options || []
          }))
        }))
        setOrderList(formattedOrders)
      }

      // 통계 로드
      const statsResponse = await orderAPI.getOrderStatistics()
      if (statsResponse.success) {
        setStatistics(statsResponse.data)
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (status) => {
    if (statusFilter === status) {
      // 같은 필터를 다시 클릭하면 필터 해제
      setStatusFilter(null)
    } else {
      setStatusFilter(status)
    }
  }

  const handleUpdateStock = async (menuId, newStock) => {
    try {
      const response = await menuAPI.updateStock(menuId, newStock)
      if (response.success) {
        onUpdateInventory(menuId, newStock)
        // 메뉴 목록 다시 로드
        loadData()
      }
    } catch (error) {
      console.error('재고 업데이트 오류:', error)
      alert('재고 업데이트에 실패했습니다.')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        onUpdateOrderStatus(orderId, newStatus)
        // 주문 목록 다시 로드
        loadData()
      }
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
      alert('주문 상태 업데이트에 실패했습니다.')
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminDashboard 
          statistics={statistics}
          statusFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />
        <div className="admin-content">
          <InventoryStatus 
            menuItems={menuItems}
            onUpdateInventory={handleUpdateStock}
          />
          <OrderStatus 
            orders={orderList} 
            onUpdateOrderStatus={handleUpdateOrderStatus}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminPage


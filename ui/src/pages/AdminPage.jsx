import { useState } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'
import './AdminPage.css'

function AdminPage({ orders, inventory, onUpdateInventory, onUpdateOrderStatus }) {
  const [statusFilter, setStatusFilter] = useState(null)

  const handleFilterChange = (status) => {
    if (statusFilter === status) {
      // 같은 필터를 다시 클릭하면 필터 해제
      setStatusFilter(null)
    } else {
      setStatusFilter(status)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminDashboard 
          orders={orders} 
          statusFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />
        <div className="admin-content">
          <InventoryStatus 
            inventory={inventory} 
            onUpdateInventory={onUpdateInventory}
          />
          <OrderStatus 
            orders={orders} 
            onUpdateOrderStatus={onUpdateOrderStatus}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminPage


import './AdminDashboard.css'

function AdminDashboard({ orders, statusFilter, onFilterChange }) {
  const totalOrders = orders.length
  const receivedOrders = orders.filter(order => order.status === 'received').length
  const inProgressOrders = orders.filter(order => order.status === 'in_progress').length
  const completedOrders = orders.filter(order => order.status === 'completed').length

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div 
          className={`stat-item ${statusFilter === null ? 'active' : ''}`}
          onClick={() => onFilterChange(null)}
        >
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{totalOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'received' ? 'active' : ''}`}
          onClick={() => onFilterChange('received')}
        >
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{receivedOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => onFilterChange('in_progress')}
        >
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{inProgressOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{completedOrders}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


import './AdminDashboard.css'

function AdminDashboard({ statistics, statusFilter, onFilterChange }) {
  const totalOrders = statistics.total || 0
  const receivedOrders = statistics.received || 0
  const inProgressOrders = statistics.inProgress || 0
  const completedOrders = statistics.completed || 0

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div 
          className={`stat-item ${statusFilter === null ? 'active' : ''}`}
          onClick={() => onFilterChange(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onFilterChange(null)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="총 주문 필터"
          aria-pressed={statusFilter === null}
        >
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{totalOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'received' ? 'active' : ''}`}
          onClick={() => onFilterChange('received')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onFilterChange('received')
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="주문 접수 필터"
          aria-pressed={statusFilter === 'received'}
        >
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{receivedOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => onFilterChange('in_progress')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onFilterChange('in_progress')
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="제조 중 필터"
          aria-pressed={statusFilter === 'in_progress'}
        >
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{inProgressOrders}</span>
        </div>
        <div 
          className={`stat-item ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onFilterChange('completed')
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="제조 완료 필터"
          aria-pressed={statusFilter === 'completed'}
        >
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{completedOrders}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


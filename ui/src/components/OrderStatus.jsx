import './OrderStatus.css'

function OrderStatus({ orders, onUpdateOrderStatus, statusFilter }) {
  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const getItemDisplayName = (item) => {
    const optionsText = item.options.length > 0 ? ` (${item.options.join(', ')})` : ''
    return `${item.menuName}${optionsText} x ${item.quantity}`
  }

  const getStatusButton = (order) => {
    if (order.status === 'received') {
      return (
        <button
          className="status-button"
          onClick={() => onUpdateOrderStatus(order.id, 'in_progress')}
          aria-label="주문 상태를 제조 중으로 변경"
        >
          제조 시작
        </button>
      )
    } else if (order.status === 'in_progress') {
      return (
        <button
          className="status-button"
          onClick={() => onUpdateOrderStatus(order.id, 'completed')}
          aria-label="주문 상태를 제조 완료로 변경"
        >
          제조 완료
        </button>
      )
    } else {
      return (
        <button 
          className="status-button completed" 
          disabled
          aria-label="제조 완료됨"
        >
          제조 완료
        </button>
      )
    }
  }

  // 필터링된 주문 목록
  let filteredOrders = orders
  if (statusFilter) {
    filteredOrders = orders.filter(order => order.status === statusFilter)
  }

  // 최신 주문이 상단에 오도록 정렬
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="order-status">
      <h2 className="section-title">주문 현황</h2>
      {sortedOrders.length === 0 ? (
        <p className="empty-orders">주문이 없습니다.</p>
      ) : (
        <div className="order-list">
          {sortedOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="order-time">{formatDate(order.createdAt)}</div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-name">
                      {getItemDisplayName(item)}
                    </div>
                  ))}
                </div>
                <div className="order-price">{formatPrice(order.totalAmount)}</div>
              </div>
              <div className="order-action">
                {getStatusButton(order)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderStatus


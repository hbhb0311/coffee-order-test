import './InventoryStatus.css'

function InventoryStatus({ menuItems, onUpdateInventory }) {
  const getStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'status-out' }
    if (quantity < 5) return { text: '주의', className: 'status-warning' }
    return { text: '정상', className: 'status-normal' }
  }

  const handleQuantityChange = (menuId, change) => {
    const menuItem = menuItems.find(m => m.id === menuId)
    if (!menuItem) return
    
    const currentQuantity = menuItem.stock || 0
    const newQuantity = Math.max(0, currentQuantity + change)
    
    // 입력 검증: 최대값 제한 (999개)
    const validatedQuantity = Math.min(999, newQuantity)
    
    onUpdateInventory(menuId, validatedQuantity)
  }

  return (
    <div className="inventory-status">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-cards">
        {menuItems.map(menuItem => {
          const quantity = menuItem.stock || 0
          const status = getStatus(quantity)
          return (
            <div key={menuItem.id} className="inventory-card">
              <div className="inventory-header">
                <h3 className="inventory-menu-name">{menuItem.name}</h3>
                <span className={`inventory-status-badge ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="inventory-quantity">
                <span className="quantity-value">{quantity}개</span>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-button"
                  onClick={() => handleQuantityChange(menuItem.id, -1)}
                  aria-label={`${menuItem.name} 재고 감소`}
                >
                  -
                </button>
                <button
                  className="inventory-button"
                  onClick={() => handleQuantityChange(menuItem.id, 1)}
                  aria-label={`${menuItem.name} 재고 증가`}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InventoryStatus


import './InventoryStatus.css'

function InventoryStatus({ inventory, onUpdateInventory }) {
  const getStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'status-out' }
    if (quantity < 5) return { text: '주의', className: 'status-warning' }
    return { text: '정상', className: 'status-normal' }
  }

  const handleQuantityChange = (menuId, change) => {
    const currentQuantity = inventory[menuId] || 0
    const newQuantity = Math.max(0, currentQuantity + change)
    
    // 입력 검증: 최대값 제한 (예: 999개)
    const validatedQuantity = Math.min(999, newQuantity)
    
    onUpdateInventory(menuId, validatedQuantity)
  }

  const menuNames = {
    1: '아메리카노 (ICE)',
    2: '아메리카노 (HOT)',
    3: '카페라떼',
    4: '카푸치노',
    5: '에스프레소',
    6: '카라멜 마키아토'
  }

  return (
    <div className="inventory-status">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-cards">
        {[1, 2, 3, 4, 5, 6].map(menuId => {
          const quantity = inventory[menuId] || 0
          const status = getStatus(quantity)
          return (
            <div key={menuId} className="inventory-card">
              <div className="inventory-header">
                <h3 className="inventory-menu-name">{menuNames[menuId]}</h3>
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
                  onClick={() => handleQuantityChange(menuId, -1)}
                  aria-label={`${menuNames[menuId]} 재고 감소`}
                >
                  -
                </button>
                <button
                  className="inventory-button"
                  onClick={() => handleQuantityChange(menuId, 1)}
                  aria-label={`${menuNames[menuId]} 재고 증가`}
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


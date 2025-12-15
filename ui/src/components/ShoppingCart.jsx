import './ShoppingCart.css'

function ShoppingCart({ cart, onOrder, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getItemDisplayName = (item) => {
    const optionsText = item.options.length > 0 ? ` (${item.options.join(', ')})` : ''
    return `${item.menuName}${optionsText}`
  }

  const handleQuantityChange = (itemKey, change) => {
    onUpdateQuantity(itemKey, change)
  }

  return (
    <div className="shopping-cart">
      <div className="cart-trigger"></div>
      <div className="cart-content">
        <div className="cart-items">
          <h3 className="cart-title">장바구니</h3>
          {cart.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다.</p>
          ) : (
            <>
              <button 
                className="clear-cart-button" 
                onClick={onClearCart}
                aria-label="장바구니 전체 삭제"
              >
                전체 삭제
              </button>
              <ul className="cart-item-list">
                {cart.map(item => (
                  <li key={item.key} className="cart-item">
                    <span className="item-name">{getItemDisplayName(item)}</span>
                    <div className="item-controls">
                      <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.key, -1)}
                        aria-label="수량 감소"
                      >
                        -
                      </button>
                      <span className="quantity-value" aria-label={`수량: ${item.quantity}`}>{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.key, 1)}
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                      </div>
                      <button
                        className="remove-item-button"
                        onClick={() => onRemoveItem(item.key)}
                        title="삭제"
                        aria-label={`${getItemDisplayName(item)} 삭제`}
                      >
                        ×
                      </button>
                      <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="cart-summary">
          <div className="total-amount">
            <span className="total-label">총 금액</span>
            <span className="total-value">{formatPrice(totalAmount)}</span>
          </div>
          <button
            className="order-button"
            onClick={onOrder}
            disabled={cart.length === 0}
            aria-label="주문하기"
            aria-disabled={cart.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart


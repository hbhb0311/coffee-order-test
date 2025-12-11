import { useState, useEffect } from 'react'
import './MenuCard.css'

function MenuCard({ menuItem, onAddToCart, resetKey }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    // resetKey가 변경되면 옵션 초기화
    setSelectedOptions([])
  }, [resetKey])

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleAddToCart = () => {
    onAddToCart(menuItem, selectedOptions)
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  return (
    <div className="menu-card">
      <div className="menu-image-container">
        {menuItem.image ? (
          <img src={menuItem.image} alt={menuItem.name} className="menu-image" />
        ) : (
          <div className="menu-image-placeholder">
            <div className="placeholder-line"></div>
            <div className="placeholder-line"></div>
          </div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menuItem.name}</h3>
        <p className="menu-price">{formatPrice(menuItem.price)}</p>
        <p className="menu-description">{menuItem.description}</p>
        <div className="menu-options">
          {menuItem.options.map(option => (
            <label key={option.id} className="option-checkbox">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <span>
                {option.name} {option.price > 0 && `(+${formatPrice(option.price)})`}
              </span>
            </label>
          ))}
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default MenuCard


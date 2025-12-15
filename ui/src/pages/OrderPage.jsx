import { useState } from 'react'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import ToastContainer from '../components/ToastContainer'
import { menuItems } from '../data/menuItems'
import { generateId } from '../utils/idGenerator'
import '../App.css'

function OrderPage({ onOrder, resetKey, setResetKey }) {
  const [cart, setCart] = useState([])
  const [toasts, setToasts] = useState([])

  const showToast = (message, duration = 3000) => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, duration }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // 옵션 처리 유틸리티 함수
  const processOptions = (menuItem, selectedOptions) => {
    const optionNames = selectedOptions
      .map(optId => {
        const option = menuItem.options.find(opt => opt.id === optId)
        return option ? option.name : null
      })
      .filter(Boolean)
    
    const optionPrice = selectedOptions.reduce((sum, optId) => {
      const option = menuItem.options.find(opt => opt.id === optId)
      return sum + (option ? option.price : 0)
    }, 0)
    
    return { optionNames, optionPrice }
  }

  const addToCart = (menuItem, selectedOptions) => {
    const optionIds = selectedOptions.sort().join(',')
    const cartKey = `${menuItem.id}-${optionIds}`
    const { optionNames, optionPrice } = processOptions(menuItem, selectedOptions)
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.key === cartKey)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.key === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [
          ...prevCart,
          {
            key: cartKey,
            menuId: menuItem.id,
            menuName: menuItem.name,
            options: optionNames,
            price: menuItem.price + optionPrice,
            quantity: 1
          }
        ]
      }
    })
    
    // 모든 메뉴 카드의 옵션 초기화
    setResetKey(prev => prev + 1)
    showToast('장바구니에 담겼습니다.')
  }

  const handleOrder = () => {
    if (cart.length === 0) {
      showToast('장바구니가 비어있습니다.')
      return
    }
    
    // 주문 생성
    const order = {
      id: generateId(),
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'received', // 주문 접수
      createdAt: new Date()
    }
    
    onOrder(order)
    showToast('주문이 완료되었습니다!')
    setCart([])
  }

  const handleDirectOrder = (menuItem, selectedOptions) => {
    // 옵션 정보 처리 (유틸리티 함수 사용)
    const { optionNames, optionPrice } = processOptions(menuItem, selectedOptions)
    
    // 주문 생성
    const order = {
      id: generateId(),
      items: [{
        key: `${menuItem.id}-${selectedOptions.sort().join(',')}`,
        menuId: menuItem.id,
        menuName: menuItem.name,
        options: optionNames,
        price: menuItem.price + optionPrice,
        quantity: 1
      }],
      totalAmount: menuItem.price + optionPrice,
      status: 'received', // 주문 접수
      createdAt: new Date()
    }
    
    onOrder(order)
    showToast('주문이 완료되었습니다!')
    
    // 모든 메뉴 카드의 옵션 초기화
    setResetKey(prev => prev + 1)
  }

  const handleUpdateQuantity = (itemKey, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.key === itemKey) {
          const newQuantity = item.quantity + change
          if (newQuantity <= 0) {
            return null // 삭제
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) // null 제거
    })
  }

  const handleRemoveItem = (itemKey) => {
    setCart(prevCart => prevCart.filter(item => item.key !== itemKey))
  }

  const handleClearCart = () => {
    setCart([])
  }

  return (
    <>
      <main className="menu-section">
        <div className="menu-grid">
          {menuItems.map(item => (
            <MenuCard
              key={item.id}
              menuItem={item}
              onAddToCart={addToCart}
              onDirectOrder={handleDirectOrder}
              resetKey={resetKey}
            />
          ))}
        </div>
      </main>
      <ShoppingCart 
        cart={cart} 
        onOrder={handleOrder} 
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default OrderPage


import { useState } from 'react'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import '../App.css'

// 메뉴 데이터
const menuItems = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '에스프레소',
    price: 3000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '카라멜 마키아토',
    price: 6000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&auto=format',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  }
]

function OrderPage({ onOrder, resetKey, setResetKey }) {
  const [cart, setCart] = useState([])

  const addToCart = (menuItem, selectedOptions) => {
    const optionIds = selectedOptions.sort().join(',')
    const cartKey = `${menuItem.id}-${optionIds}`
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.key === cartKey)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.key === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
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
    alert('장바구니에 담겼습니다.')
  }

  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    
    // 주문 생성
    const order = {
      id: Date.now(),
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'received', // 주문 접수
      createdAt: new Date()
    }
    
    onOrder(order)
    alert('주문이 완료되었습니다!')
    setCart([])
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
    </>
  )
}

export default OrderPage


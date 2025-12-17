import { useState, useEffect } from 'react'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import ToastContainer from '../components/ToastContainer'
import { menuAPI, orderAPI } from '../utils/api'
import { generateId } from '../utils/idGenerator'
import '../App.css'

function OrderPage({ onOrder, resetKey, setResetKey, inventory, onUpdateInventory }) {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(true)

  // 메뉴 목록 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await menuAPI.getAllMenus()
        if (response.success) {
          // API 응답을 프론트엔드 형식으로 변환
          const formattedMenus = response.data.map(menu => ({
            id: menu.prd_id,
            name: menu.prd_nm,
            price: menu.prd_prc,
            description: menu.prd_desc || '간단한 설명...',
            image: menu.prd_img,
            stock: menu.prd_stk,
            options: menu.options.map(opt => ({
              id: opt.opt_id,
              name: opt.opt_nm,
              price: opt.opt_prc
            }))
          }))
          setMenuItems(formattedMenus)
          
          // 재고 정보 업데이트
          const stockMap = {}
          formattedMenus.forEach(menu => {
            stockMap[menu.id] = menu.stock
          })
          Object.keys(stockMap).forEach(menuId => {
            onUpdateInventory(parseInt(menuId), stockMap[menuId])
          })
        }
      } catch (error) {
        console.error('메뉴 로드 오류:', error)
        showToast('메뉴를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    loadMenus()
  }, [])

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

  const handleOrder = async () => {
    if (cart.length === 0) {
      showToast('장바구니가 비어있습니다.')
      return
    }
    
    try {
      // API 형식으로 변환
      const orderItems = cart.map(item => {
        // 옵션 ID 찾기
        const menuItem = menuItems.find(m => m.id === item.menuId)
        const optionIds = item.options.map(optName => {
          const option = menuItem?.options.find(opt => opt.name === optName)
          return option?.id
        }).filter(Boolean)
        
        return {
          prdId: item.menuId,
          prd_cnt: item.quantity,
          optionIds: optionIds,
          unitPrice: item.price,
          subtotal: item.price * item.quantity
        }
      })
      
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      // API 호출
      const response = await orderAPI.createOrder({
        items: orderItems,
        totalAmount
      })
      
      if (response.success) {
        // 주문 성공
        const order = {
          id: response.data.orderId,
          items: cart,
          totalAmount: response.data.totalAmount,
          status: response.data.status,
          createdAt: new Date(response.data.orderDate)
        }
        
        onOrder(order)
        showToast('주문이 완료되었습니다!')
        setCart([])
        
        // 메뉴 목록 다시 로드하여 재고 업데이트
        const menuResponse = await menuAPI.getAllMenus()
        if (menuResponse.success) {
          menuResponse.data.forEach(menu => {
            onUpdateInventory(menu.prd_id, menu.prd_stk)
          })
        }
      }
    } catch (error) {
      console.error('주문 생성 오류:', error)
      if (error.message.includes('재고')) {
        showToast('재고가 없습니다.')
      } else {
        showToast('주문 처리 중 오류가 발생했습니다.')
      }
    }
  }

  const handleDirectOrder = async (menuItem, selectedOptions) => {
    try {
      // 옵션 정보 처리
      const { optionNames, optionPrice } = processOptions(menuItem, selectedOptions)
      
      // 옵션 ID 찾기
      const optionIds = selectedOptions.map(optId => {
        const option = menuItem.options.find(opt => opt.id === optId)
        return option?.id
      }).filter(Boolean)
      
      // API 호출
      const response = await orderAPI.createOrder({
        items: [{
          prdId: menuItem.id,
          prd_cnt: 1,
          optionIds: optionIds,
          unitPrice: menuItem.price + optionPrice,
          subtotal: menuItem.price + optionPrice
        }],
        totalAmount: menuItem.price + optionPrice
      })
      
      if (response.success) {
        // 주문 성공
        const order = {
          id: response.data.orderId,
          items: [{
            key: `${menuItem.id}-${selectedOptions.sort().join(',')}`,
            menuId: menuItem.id,
            menuName: menuItem.name,
            options: optionNames,
            price: menuItem.price + optionPrice,
            quantity: 1
          }],
          totalAmount: response.data.totalAmount,
          status: response.data.status,
          createdAt: new Date(response.data.orderDate)
        }
        
        onOrder(order)
        showToast('주문이 완료되었습니다!')
        
        // 모든 메뉴 카드의 옵션 초기화
        setResetKey(prev => prev + 1)
        
        // 메뉴 목록 다시 로드하여 재고 업데이트
        const menuResponse = await menuAPI.getAllMenus()
        if (menuResponse.success) {
          menuResponse.data.forEach(menu => {
            onUpdateInventory(menu.prd_id, menu.prd_stk)
          })
        }
      }
    } catch (error) {
      console.error('주문 생성 오류:', error)
      if (error.message.includes('재고')) {
        showToast('재고가 없습니다.')
      } else {
        showToast('주문 처리 중 오류가 발생했습니다.')
      }
    }
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

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>메뉴를 불러오는 중...</div>
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


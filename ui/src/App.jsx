import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [resetKey, setResetKey] = useState(0)
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState({
    1: 10, // 아메리카노 (ICE)
    2: 10, // 아메리카노 (HOT)
    3: 10, // 카페라떼
    4: 10, // 카푸치노
    5: 10, // 에스프레소
    6: 10  // 카라멜 마키아토
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleOrder = (order) => {
    setOrders(prevOrders => [...prevOrders, order])
  }

  const handleUpdateInventory = (menuId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [menuId]: quantity
    }))
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    )
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      {currentPage === 'order' ? (
        <OrderPage 
          onOrder={handleOrder}
          resetKey={resetKey}
          setResetKey={setResetKey}
          inventory={inventory}
          onUpdateInventory={handleUpdateInventory}
        />
      ) : (
        <AdminPage
          orders={orders}
          inventory={inventory}
          onUpdateInventory={handleUpdateInventory}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  )
}

export default App

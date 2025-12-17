import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [resetKey, setResetKey] = useState(0)
  const [inventory, setInventory] = useState({})

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleOrder = (order) => {
    // 주문은 백엔드에서 관리하므로 여기서는 로그만 남김
    console.log('주문 완료:', order)
  }

  const handleUpdateInventory = (menuId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [menuId]: quantity
    }))
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // 주문 상태는 백엔드에서 관리하므로 여기서는 로그만 남김
    console.log('주문 상태 변경:', orderId, newStatus)
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
          inventory={inventory}
          onUpdateInventory={handleUpdateInventory}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  )
}

export default App

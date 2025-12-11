import './Header.css'

function Header({ currentPage, onPageChange }) {
  const handleAdminClick = () => {
    onPageChange('admin')
  }

  const handleOrderClick = () => {
    onPageChange('order')
  }

  return (
    <header className="header">
      <div className="logo">COFFEELUV</div>
      <div className="nav-buttons">
        <button
          className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
          onClick={handleOrderClick}
        >
          주문하기
        </button>
        <button
          className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={handleAdminClick}
        >
          관리자
        </button>
      </div>
    </header>
  )
}

export default Header


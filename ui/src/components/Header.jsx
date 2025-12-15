import './Header.css'

function Header({ currentPage, onPageChange }) {
  const handleAdminClick = () => {
    onPageChange('admin')
  }

  const handleOrderClick = () => {
    onPageChange('order')
  }

  return (
    <header className="header" role="banner">
      <div className="logo" aria-label="COFFEELUV 로고">COFFEELUV</div>
      <nav className="nav-buttons" role="navigation" aria-label="주요 네비게이션">
        <button
          className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
          onClick={handleOrderClick}
          aria-label="주문하기 페이지"
          aria-current={currentPage === 'order' ? 'page' : undefined}
        >
          주문하기
        </button>
        <button
          className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={handleAdminClick}
          aria-label="관리자 페이지"
          aria-current={currentPage === 'admin' ? 'page' : undefined}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}

export default Header


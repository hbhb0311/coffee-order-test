import './Header.css'

function Header({ currentPage }) {
  const handleAdminClick = () => {
    // 관리자 화면으로 이동 (추후 구현)
    console.log('관리자 화면으로 이동')
  }

  const handleOrderClick = () => {
    // 주문하기 화면으로 이동 (추후 구현)
    console.log('주문하기 화면으로 이동')
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


import { useState } from 'react'

function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
    document.body.classList.toggle('sidebar-open', !isOpen)
  }

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar} aria-label="切换菜单">
        <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
      </button>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  )
}

export default MobileHeader

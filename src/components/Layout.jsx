import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'
import MobileBottomNav from './MobileBottomNav'

function Layout() {
  return (
    <div className="layout">
      <MobileHeader />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  )
}

export default Layout

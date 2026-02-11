import { NavLink } from 'react-router-dom'
import { useDailyFiles } from '../hooks/useDailyFiles'

function MobileBottomNav() {
  const { files } = useDailyFiles()
  const recentFiles = files.slice(0, 5)

  return (
    <nav className="mobile-bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>首页</span>
      </NavLink>
      
      {recentFiles.slice(0, 3).map((file) => (
        <NavLink 
          key={file.path}
          to={file.path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>{file.title}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav

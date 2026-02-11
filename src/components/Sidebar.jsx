import { NavLink } from 'react-router-dom'
import { useDailyFiles } from '../hooks/useDailyFiles'

function Sidebar() {
  const { files, loading, error } = useDailyFiles()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="site-title">
          <NavLink to="/">Tech Trends</NavLink>
        </h1>
        <div className="site-subtitle">Daily Tech Trends</div>
      </div>

      <nav className="sidebar-nav">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">加载失败</div>
        ) : (
          <div className="nav-content">
            <div className="nav-section-title">
              <span className="nav-section-line"></span>
              <span>Archives</span>
            </div>
            <ul className="nav-list">
              {files.map((file, index) => (
                <li key={file.path} className="nav-item">
                  <NavLink 
                    to={file.path}
                    className={({ isActive }) => 
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span className="nav-text">{file.title}</span>
                    {index === 0 && <span className="nav-badge">NEW</span>}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="nav-section-title">
              <span className="nav-section-line"></span>
              <span>Pages</span>
            </div>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="nav-text">首页</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 Tech Trends</p>
      </div>
    </aside>
  )
}

export default Sidebar

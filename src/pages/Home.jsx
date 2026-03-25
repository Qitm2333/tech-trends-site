import { Link } from 'react-router-dom'
import { useDailyFiles } from '../hooks/useDailyFiles'

function Home() {
  const { files, loading, error, refresh } = useDailyFiles()
  const highlightedFiles = files.slice(0, 6)

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Tech Trends</h1>
        <p className="tagline">每日追踪 GitHub 热门项目与 AI 最新动态</p>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>正在加载...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>获取日报列表失败：{error}</p>
            <button className="retry-btn" onClick={refresh}>
              重试
            </button>
          </div>
        ) : highlightedFiles.length === 0 ? (
          <div className="empty-state">
            <p>暂无日报内容</p>
            <p className="hint">请在 docs/ 目录下添加 Markdown 文件后刷新页面</p>
          </div>
        ) : (
          <>
            <div className="home-file-list">
              {highlightedFiles.map((file, index) => (
                <Link key={file.path} to={file.path} className="home-file-item">
                  <div className="home-file-date">{file.title}</div>
                  <div className="home-file-title">{file.fullTitle}</div>
                  {index === 0 && <span className="home-file-badge">NEW</span>}
                </Link>
              ))}
            </div>
            {files.length > highlightedFiles.length && (
              <div className="home-more-link">
                <p>完整归档请通过侧边栏或底部导航查看。</p>
                <Link to={files[0].path} className="btn secondary">
                  查看最新日报
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home

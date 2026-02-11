import { useDailyFiles } from '../hooks/useDailyFiles'

function Home() {
  const { files, loading } = useDailyFiles()

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
        ) : files.length === 0 ? (
          <div className="empty-state">
            <p>暂无日报内容</p>
            <p className="hint">请在 docs/2026-02/ 目录下添加 Markdown 文件</p>
          </div>
        ) : (
          <div className="home-file-list">
            {files.map((file, index) => (
              <a key={file.path} href={`#${file.path}`} className="home-file-item">
                <div className="home-file-date">{file.title}</div>
                <div className="home-file-title">{file.fullTitle}</div>
                {index === 0 && <span className="home-file-badge">NEW</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

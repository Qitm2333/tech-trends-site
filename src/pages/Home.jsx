import { useEffect } from 'react'
import { useDailyFiles } from '../hooks/useDailyFiles'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { files, loading } = useDailyFiles()
  const navigate = useNavigate()

  useEffect(() => {
    // 如果有日报文件，自动跳转到最新的日报
    if (!loading && files.length > 0) {
      navigate(files[0].path)
    }
  }, [files, loading, navigate])

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
        ) : null}
      </div>
    </div>
  )
}

export default Home

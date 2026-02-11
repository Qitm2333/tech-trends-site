import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function DailyReport() {
  const { date } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef(null)
  const captureRef = useRef(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        const basePath = import.meta.env.BASE_URL || '/'
        const response = await fetch(`${basePath}docs/2026-02/${date}.md`)
        if (!response.ok) {
          throw new Error('文件不存在')
        }
        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError('文件不存在或加载失败')
        console.error('加载日报失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [date])

  const extractDate = (content) => {
    const match = content.match(/#\s*(\d{4})年(\d{1,2})月(\d{1,2})日/)
    if (match) {
      return {
        year: match[1],
        month: match[2].padStart(2, '0'),
        day: match[3].padStart(2, '0')
      }
    }
    return {
      year: '2026',
      month: '02',
      day: date.padStart(2, '0')
    }
  }

  const dateInfo = extractDate(content)
  const displayDate = `${dateInfo.year}年${dateInfo.month}月${dateInfo.day}日`

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setTimeout(() => setIsPrinting(false), 500)
    }, 300)
  }

  const handleExportImage = async () => {
    setIsExporting(true)
    
    // 保存原始滚动位置
    const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    try {
      // 动态加载 html2canvas CDN
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      
      if (captureRef.current && window.html2canvas) {
        // 先展开所有内容
        const expandAllEvent = new CustomEvent('expand-all-for-export')
        document.dispatchEvent(expandAllEvent)
        
        // 等待内容展开和渲染完成
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 获取完整内容的实际尺寸
        const element = captureRef.current
        const rect = element.getBoundingClientRect()
        
        // 创建一个新的容器来包裹所有内容
        const wrapper = document.createElement('div')
        wrapper.style.position = 'fixed'
        wrapper.style.left = '-9999px'
        wrapper.style.top = '0'
        wrapper.style.width = '880px'
        wrapper.style.backgroundColor = '#faf9f7'
        wrapper.style.zIndex = '-9999'
        wrapper.style.padding = '40px'
        wrapper.style.boxSizing = 'border-box'
        
        // 克隆内容
        const clone = element.cloneNode(true)
        clone.style.width = '100%'
        clone.style.height = 'auto'
        clone.style.maxHeight = 'none'
        clone.style.overflow = 'visible'
        clone.style.margin = '0'
        clone.style.padding = '0'
        
        // 确保所有卡片都展开
        const cards = clone.querySelectorAll('.project-card')
        cards.forEach(card => {
          card.classList.add('expanded')
          card.style.width = '100%'
          card.style.margin = '15px 0'
          const content = card.querySelector('.project-card-content')
          if (content) {
            content.style.maxHeight = 'none'
            content.style.padding = '20px'
            content.style.overflow = 'visible'
          }
        })
        
        // 修复 markdown-content 样式
        const markdownContent = clone.querySelector('.markdown-content')
        if (markdownContent) {
          markdownContent.style.width = '100%'
          markdownContent.style.maxWidth = '100%'
        }
        
        wrapper.appendChild(clone)
        document.body.appendChild(wrapper)
        
        // 等待克隆的内容渲染
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const canvas = await window.html2canvas(wrapper, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#faf9f7',
          logging: false,
          width: 880,
          height: wrapper.scrollHeight,
          windowWidth: 880,
          windowHeight: wrapper.scrollHeight,
        })
        
        // 清理临时元素
        document.body.removeChild(wrapper)
        
        const link = document.createElement('a')
        link.download = `技术趋势日报-${dateInfo.year}-${dateInfo.month}-${dateInfo.day}.png`
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
      }
    } catch (err) {
      console.error('导出图片失败:', err)
      alert('导出图片失败，请重试')
    } finally {
      // 恢复滚动位置
      window.scrollTo(0, originalScrollTop)
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>正在加载日报...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>加载失败</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <article className="daily-report">
      <div className="daily-header">
        <h1>技术趋势日报</h1>
        <div className="daily-meta">
          <span className="date">{displayDate}</span>
          <span className="separator">·</span>
          <span className="source">GitHub & AI 资讯</span>
        </div>
        <div className="action-buttons">
          <button className="print-btn" onClick={handlePrint} title="打印日报">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>打印</span>
          </button>
          <button className="export-btn" onClick={handleExportImage} disabled={isExporting} title="导出长图">
            {isExporting ? (
              <>
                <svg className="spinner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"></circle>
                </svg>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>导出长图</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div ref={contentRef} className={`print-content ${isPrinting ? 'printing' : ''}`}>
        <div ref={captureRef} className="capture-area">
          <ContentRenderer content={content} isPrinting={isPrinting} />
        </div>
      </div>
    </article>
  )
}

// 内容渲染器 - 处理 Markdown 和 HTML 混合内容
function ContentRenderer({ content, isPrinting }) {
  // 解析内容为段落数组
  const segments = parseContent(content)
  
  return (
    <div className="markdown-content">
      {segments.map((segment, index) => (
        <Segment key={index} segment={segment} isPrinting={isPrinting} />
      ))}
    </div>
  )
}

// 单个段落渲染
function Segment({ segment, isPrinting }) {
  if (segment.type === 'html') {
    if (segment.content.includes('project-card')) {
      return <ProjectCard html={segment.content} isPrinting={isPrinting} />
    }
    if (segment.content.includes('news-card')) {
      return <NewsCard html={segment.content} />
    }
    return <div dangerouslySetInnerHTML={{ __html: segment.content }} />
  }
  
  const cleanedContent = segment.content.replace(/^(####\s*)#(\d+\s*)/gm, '$1$2')
  
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
    >
      {cleanedContent}
    </ReactMarkdown>
  )
}

// 项目卡片组件 - 保留原始结构和点击展开功能
function ProjectCard({ html, isPrinting }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [forceExpanded, setForceExpanded] = useState(false)
  
  // 监听导出事件
  useEffect(() => {
    const handleExpandAll = () => {
      setForceExpanded(true)
    }
    document.addEventListener('expand-all-for-export', handleExpandAll)
    return () => {
      document.removeEventListener('expand-all-for-export', handleExpandAll)
    }
  }, [])
  
  // 打印时自动展开
  const expanded = isPrinting || isExpanded || forceExpanded
  
  // 解析 HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const card = doc.querySelector('.project-card')
  
  if (!card) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }
  
  const className = card.className
  const header = card.querySelector('.project-card-header')
  const basic = card.querySelector('.project-card-basic')
  const contentDiv = card.querySelector('.project-card-content')
  
  // 提取 header 中的标题和切换按钮
  const headerTitle = header?.querySelector('h4')?.textContent || ''
  const toggleIcon = header?.querySelector('.project-card-toggle')?.textContent || '▼'
  
  // 转换 content 内部的 HTML 为 Markdown
  let contentMarkdown = ''
  if (contentDiv) {
    contentMarkdown = htmlToMarkdown(contentDiv.innerHTML)
  }
  
  const handleToggle = () => {
    if (!isPrinting) {
      setIsExpanded(!isExpanded)
    }
  }
  
  return (
    <div className={`${className} ${expanded ? 'expanded' : ''}`}>
      {header && (
        <div 
          className="project-card-header" 
          onClick={handleToggle}
          style={{ cursor: isPrinting ? 'default' : 'pointer' }}
        >
          <h4>{headerTitle}</h4>
          <span className="project-card-toggle">{toggleIcon}</span>
        </div>
      )}
      {basic && (
        <div 
          className="project-card-basic" 
          dangerouslySetInnerHTML={{ __html: basic.innerHTML }}
        />
      )}
      {contentDiv && (
        <div 
          className="project-card-content"
          style={{ 
            maxHeight: expanded ? '2000px' : '0',
            padding: expanded ? 'var(--space-6)' : '0 var(--space-6)',
            overflow: 'hidden',
            transition: isPrinting ? 'none' : 'all 0.3s ease'
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentMarkdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

// 新闻卡片组件 - 转换内部 Markdown
function NewsCard({ html }) {
  // 解析 HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const card = doc.querySelector('.news-card')
  
  if (!card) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }
  
  const className = card.className
  const markdownContent = htmlToMarkdown(card.innerHTML)
  
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

// HTML 转 Markdown 工具函数
function htmlToMarkdown(innerHtml) {
  return innerHtml
    // 转换 h4 标题
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    // 转换 h3 标题
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    // 转换 h2 标题
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    // 转换 p 标签
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // 转换 strong/b 标签
    .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**')
    // 转换 em/i 标签
    .replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*')
    // 转换 ul/ol 列表
    .replace(/<ul[^>]*>\s*/gi, '\n')
    .replace(/<\/ul>\s*/gi, '\n')
    .replace(/<ol[^>]*>\s*/gi, '\n')
    .replace(/<\/ol>\s*/gi, '\n')
    // 转换 li 标签
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // 转换 br 标签
    .replace(/<br\s*\/?>/gi, '\n')
    // 转换表格
    .replace(/<table[^>]*>(.*?)<\/table>/gi, (match) => {
      return match
        .replace(/<thead[^>]*>(.*?)<\/thead>/gi, '$1')
        .replace(/<tbody[^>]*>(.*?)<\/tbody>/gi, '$1')
        .replace(/<tr[^>]*>(.*?)<\/tr>/gi, (trMatch, trContent) => {
          const cells = trContent.match(/<(th|td)[^>]*>(.*?)<\/\1>/gi) || []
          const row = cells.map(cell => cell.replace(/<(th|td)[^>]*>(.*?)<\/\1>/i, '$2').trim()).join(' | ')
          return '| ' + row + ' |'
        })
        .replace(/<\/table>/gi, '')
    })
    // 移除其他 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 解码 HTML 实体
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    // 清理多余换行
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// 提取完整的 HTML 块（处理嵌套标签）
function extractHtmlBlock(content, startPos) {
  const tagMatch = content.slice(startPos).match(/^<([a-zA-Z][a-zA-Z0-9]*)[^>]*?>/)
  if (!tagMatch) return null
  
  const tagName = tagMatch[1]
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']
  
  // 自闭合标签
  if (selfClosingTags.includes(tagName.toLowerCase())) {
    const endPos = startPos + tagMatch[0].length
    return { html: content.slice(startPos, endPos), endPos }
  }
  
  // 查找对应的结束标签（处理嵌套）
  let depth = 1
  let pos = startPos + tagMatch[0].length
  
  while (pos < content.length && depth > 0) {
    const remaining = content.slice(pos)
    const openTag = remaining.match(new RegExp(`<${tagName}[^>]*?>`, 'i'))
    const closeTag = remaining.match(new RegExp(`</${tagName}>`, 'i'))
    
    const openPos = openTag ? pos + openTag.index : Infinity
    const closePos = closeTag ? pos + closeTag.index : Infinity
    
    if (closePos === Infinity) {
      return null // 没有找到结束标签
    }
    
    if (openPos < closePos) {
      depth++
      pos = openPos + openTag[0].length
    } else {
      depth--
      pos = closePos + closeTag[0].length
    }
  }
  
  if (depth === 0) {
    return { html: content.slice(startPos, pos), endPos: pos }
  }
  
  return null
}

// 查找 HTML 标签开始位置
function findHtmlTagStart(content, startPos) {
  let pos = startPos
  while (pos < content.length) {
    const ltIndex = content.indexOf('<', pos)
    if (ltIndex === -1) return -1
    
    const afterLt = content.slice(ltIndex + 1)
    const match = afterLt.match(/^(div|p|table)(?:\s|>)/i)
    if (match) {
      return ltIndex
    }
    pos = ltIndex + 1
  }
  return -1
}

// 解析内容，将 HTML 和 Markdown 分开
function parseContent(content) {
  const segments = []
  let pos = 0
  
  while (pos < content.length) {
    // 查找 HTML 标签开始
    const htmlStart = findHtmlTagStart(content, pos)
    
    if (htmlStart === -1) {
      // 没有更多 HTML 标签了
      const remaining = content.slice(pos)
      if (remaining) {
        // 移除标题行
        const cleaned = remaining.replace(/^#\s*\d{4}年\d{1,2}月\d{1,2}日.*$/m, '').trim()
        if (cleaned) {
          segments.push({ type: 'markdown', content: cleaned })
        }
      }
      break
    }
    
    // 添加 HTML 之前的 Markdown 内容
    if (htmlStart > pos) {
      let markdownContent = content.slice(pos, htmlStart)
      // 只移除开头和结尾的换行，保留内容中的空格和格式
      markdownContent = markdownContent.replace(/^\n+/, '').replace(/\n+$/, '')
      if (markdownContent && !markdownContent.match(/^#\s*\d{4}年/)) {
        segments.push({ type: 'markdown', content: markdownContent })
      }
    }
    
    // 提取完整的 HTML 块
    const htmlResult = extractHtmlBlock(content, htmlStart)
    if (htmlResult) {
      segments.push({ type: 'html', content: htmlResult.html })
      pos = htmlResult.endPos
    } else {
      // 无法提取完整的 HTML，跳过这个 <
      pos = htmlStart + 1
    }
  }
  
  return segments.length > 0 ? segments : [{ type: 'markdown', content }]
}

export default DailyReport

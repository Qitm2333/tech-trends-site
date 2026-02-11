// 自动扫描目录获取日报文件列表
// 动态扫描 docs/2026-02 目录下的所有 .md 文件

// 尝试从目录索引获取文件列表
async function fetchDirectoryListing() {
  try {
    // 尝试获取目录列表（如果服务器支持）
    const response = await fetch('/docs/2026-02/')
    if (response.ok) {
      const html = await response.text()
      // 解析 HTML 中的文件链接
      const matches = html.match(/href="([^"]+\.md)"/g)
      if (matches) {
        return matches.map(m => m.replace('href="', '').replace('"', ''))
      }
    }
  } catch (e) {
    console.log('目录索引获取失败，使用动态探测模式')
  }
  return null
}

// 动态探测文件（尝试 1-31 日的文件）
async function detectFilesDynamically() {
  const files = []
  const promises = []
  
  // 尝试探测 1-31 日的文件
  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')
    const fileName = `${dayStr}.md`
    
    promises.push(
      fetch(`/docs/2026-02/${fileName}`)
        .then(async res => {
          const contentType = res.headers.get('Content-Type') || ''
          if (res.ok && (contentType.includes('markdown') || contentType.includes('text/'))) {
            const text = await res.text()
            if (text.trim().startsWith('#')) {
              return fileName
            }
          }
          return null
        })
        .catch(() => null)
    )
  }
  
  const results = await Promise.all(promises)
  return results.filter(Boolean)
}

export async function scanDailyFiles() {
  const files = []
  
  // 首先尝试获取目录列表
  let fileList = await fetchDirectoryListing()
  
  // 如果目录列表获取失败，使用动态探测
  if (!fileList || fileList.length === 0) {
    fileList = await detectFilesDynamically()
  }
  
  // 并行加载所有文件内容
  const filePromises = fileList.map(async (fileName) => {
    const day = fileName.replace('.md', '')
    
    try {
      const response = await fetch(`/docs/2026-02/${fileName}`)
      if (!response.ok) return null
      
      const content = await response.text()
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : `${day}日`
      
      // 提取标签
      const tags = extractTags(content)
      
      return {
        date: `2026-02-${day}`,
        file: fileName,
        day: day,
        title: `02月${day}日`,
        fullTitle: title,
        path: `/2026-02/${day}`,
        tags: tags
      }
    } catch (err) {
      console.warn(`无法加载文件 ${fileName}:`, err)
      return null
    }
  })
  
  const results = await Promise.all(filePromises)
  files.push(...results.filter(Boolean))
  
  // 按日期倒序排列
  files.sort((a, b) => parseInt(b.day) - parseInt(a.day))
  
  console.log(`[fileScanner] 扫描到 ${files.length} 个日报文件:`, files.map(f => f.file))
  return files
}

function extractTags(content) {
  const tags = []
  const tagPatterns = [
    { pattern: /AI|人工智能|Agent|LLM/i, tag: 'AI' },
    { pattern: /GitHub|开源|项目/i, tag: 'GitHub' },
    { pattern: /React|Vue|Angular|前端/i, tag: '前端' },
    { pattern: /Python|JavaScript|TypeScript|Rust/i, tag: '编程' }
  ]
  
  tagPatterns.forEach(({ pattern, tag }) => {
    if (pattern.test(content) && !tags.includes(tag)) {
      tags.push(tag)
    }
  })
  
  return tags.length > 0 ? tags : ['日报']
}

// 获取最新文件
export function getLatestFile(files) {
  return files.length > 0 ? files[0] : null
}

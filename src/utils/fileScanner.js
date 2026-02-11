// 自动扫描目录获取日报文件列表
// 动态扫描 docs/2026-02 目录下的所有 .md 文件

// 获取基础路径
const getBasePath = () => {
  return import.meta.env.BASE_URL || '/'
}

// 尝试从目录索引获取文件列表
async function fetchDirectoryListing() {
  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}docs/2026-02/`)
    if (response.ok) {
      const html = await response.text()
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
  const basePath = getBasePath()
  
  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')
    const fileName = `${dayStr}.md`
    
    promises.push(
      fetch(`${basePath}docs/2026-02/${fileName}`)
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
  const basePath = getBasePath()
  
  let fileList = await fetchDirectoryListing()
  
  if (!fileList || fileList.length === 0) {
    fileList = await detectFilesDynamically()
  }
  
  const filePromises = fileList.map(async (fileName) => {
    const day = fileName.replace('.md', '')
    
    try {
      const response = await fetch(`${basePath}docs/2026-02/${fileName}`)
      if (!response.ok) return null
      
      const content = await response.text()
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : `${day}日`
      
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

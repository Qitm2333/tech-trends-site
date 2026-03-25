const getBasePath = () => {
  return import.meta.env.BASE_URL || '/'
}

async function fetchDirectoryListing(yearMonth) {
  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}docs/${yearMonth}/`)
    if (response.ok) {
      const html = await response.text()
      const matches = html.match(/href="([^"]+\.md)"/g)
      if (matches) {
        return matches.map(m => m.replace('href="', '').replace('"', ''))
      }
    }
  } catch (e) {
    console.log(`目录索引获取失败 ${yearMonth}，使用动态探测模式`)
  }
  return null
}

async function detectFilesDynamically(yearMonth) {
  const files = []
  const promises = []
  const basePath = getBasePath()
  
  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')
    const fileName = `${dayStr}.md`
    
    promises.push(
      fetch(`${basePath}docs/${yearMonth}/${fileName}`)
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

async function scanMonthDirectory(yearMonth) {
  const files = []
  const basePath = getBasePath()
  
  let fileList = await fetchDirectoryListing(yearMonth)
  
  if (!fileList || fileList.length === 0) {
    fileList = await detectFilesDynamically(yearMonth)
  }
  
  if (!fileList || fileList.length === 0) {
    return []
  }
  
  const [year, month] = yearMonth.split('-')
  const monthNum = parseInt(month)
  
  const filePromises = fileList.map(async (fileName) => {
    const day = fileName.replace('.md', '')
    
    try {
      const response = await fetch(`${basePath}docs/${yearMonth}/${fileName}`)
      if (!response.ok) return null
      
      const content = await response.text()
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : `${day}日`
      
      const tags = extractTags(content)
      
      return {
        date: `${yearMonth}-${day}`,
        yearMonth: yearMonth,
        year: year,
        month: month,
        file: fileName,
        day: day,
        title: `${monthNum}月${day}日`,
        fullTitle: title,
        path: `/${yearMonth}/${day}`,
        tags: tags
      }
    } catch (err) {
      console.warn(`无法加载文件 ${fileName}:`, err)
      return null
    }
  })
  
  const results = await Promise.all(filePromises)
  return results.filter(Boolean)
}

export async function scanDailyFiles() {
  const allFiles = []
  const basePath = getBasePath()
  
  const currentYear = 2026
  const currentMonth = 3
  
  const monthsToScan = []
  for (let year = currentYear; year >= currentYear; year--) {
    const startMonth = (year === currentYear) ? currentMonth : 12
    for (let month = startMonth; month >= 1; month--) {
      monthsToScan.push(`${year}-${month.toString().padStart(2, '0')}`)
    }
  }
  
  console.log('[fileScanner] 将扫描以下月份目录:', monthsToScan)
  
  for (const yearMonth of monthsToScan) {
    const monthFiles = await scanMonthDirectory(yearMonth)
    if (monthFiles.length > 0) {
      allFiles.push(...monthFiles)
      console.log(`[fileScanner] 在 ${yearMonth} 找到 ${monthFiles.length} 个文件`)
    }
  }
  
  allFiles.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA
  })
  
  console.log(`[fileScanner] 总共扫描到 ${allFiles.length} 个日报文件:`, allFiles.map(f => f.path))
  return allFiles
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

export function getLatestFile(files) {
  return files.length > 0 ? files[0] : null
}

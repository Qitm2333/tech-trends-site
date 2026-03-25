const docModules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('../../docs/**/*.md', { query: '?raw', import: 'default' })
    : {}

const getBasePath = () => {
  return import.meta.env.BASE_URL || '/'
}

function parseDocPath(path) {
  const match = path.match(/docs\/(\d{4}-\d{2})\/(\d{2})\.md$/)
  if (!match) return null
  const [, yearMonth, day] = match
  const [year, month] = yearMonth.split('-')
  return {
    yearMonth,
    year,
    month,
    day,
    file: `${day}.md`,
    title: `${parseInt(month, 10)}月${day}日`,
    route: `/${yearMonth}/${day}`
  }
}

async function scanFromBuildManifest() {
  const entries = Object.entries(docModules)
    .map(([path, loader]) => {
      const parsed = parseDocPath(path)
      if (!parsed) return null
      return { ...parsed, loader }
    })
    .filter(Boolean)

  if (entries.length === 0) {
    return []
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      try {
        const content = await entry.loader()
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : `${entry.day}日`
        const tags = extractTags(content)
        return {
          date: `${entry.yearMonth}-${entry.day}`,
          yearMonth: entry.yearMonth,
          year: entry.year,
          month: entry.month,
          file: entry.file,
          day: entry.day,
          title: entry.title,
          fullTitle: title,
          path: entry.route,
          tags
        }
      } catch (err) {
        console.warn(`[fileScanner] Failed to read ${entry.route} from manifest`, err)
        return null
      }
    })
  )

  return sortFiles(files.filter(Boolean))
}

function getMonthRange(months = 12) {
  const result = []
  const cursor = new Date()

  for (let i = 0; i < months; i++) {
    const year = cursor.getFullYear()
    const month = String(cursor.getMonth() + 1).padStart(2, '0')
    result.push(`${year}-${month}`)
    cursor.setMonth(cursor.getMonth() - 1)
  }

  return result
}

async function fetchDirectoryListing(yearMonth) {
  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}docs/${yearMonth}/`)
    if (response.ok) {
      const html = await response.text()
      const matches = html.match(/href="([^"]+\.md)"/g)
      if (matches) {
        return matches.map((m) => m.replace('href="', '').replace('"', ''))
      }
    }
  } catch (err) {
    console.warn(`[fileScanner] Unable to read directory listing for ${yearMonth}`, err)
  }
  return null
}

async function detectFilesDynamically(yearMonth) {
  const basePath = getBasePath()
  const requests = []

  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')
    const fileName = `${dayStr}.md`
    requests.push(
      fetch(`${basePath}docs/${yearMonth}/${fileName}`)
        .then(async (res) => {
          if (!res.ok) return null
          const contentType = res.headers.get('Content-Type') || ''
          if (!contentType.includes('markdown') && !contentType.includes('text/')) {
            return null
          }
          const text = await res.text()
          return text.trim().startsWith('#') ? fileName : null
        })
        .catch(() => null)
    )
  }

  const results = await Promise.all(requests)
  return results.filter(Boolean)
}

async function scanMonthDirectory(yearMonth) {
  let fileList = await fetchDirectoryListing(yearMonth)
  if (!fileList || fileList.length === 0) {
    fileList = await detectFilesDynamically(yearMonth)
  }

  if (!fileList || fileList.length === 0) {
    return []
  }

  const [year, month] = yearMonth.split('-')
  const monthNum = parseInt(month, 10)
  const basePath = getBasePath()

  const files = await Promise.all(
    fileList.map(async (fileName) => {
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
          yearMonth,
          year,
          month,
          file: fileName,
          day,
          title: `${monthNum}月${day}日`,
          fullTitle: title,
          path: `/${yearMonth}/${day}`,
          tags
        }
      } catch (err) {
        console.warn(`[fileScanner] Failed to load ${fileName}`, err)
        return null
      }
    })
  )

  return files.filter(Boolean)
}

async function scanViaNetwork() {
  const monthsToScan = getMonthRange(12)
  const allFiles = []

  for (const yearMonth of monthsToScan) {
    const monthFiles = await scanMonthDirectory(yearMonth)
    if (monthFiles.length > 0) {
      allFiles.push(...monthFiles)
    } else if (allFiles.length > 0) {
      break
    }
  }

  return sortFiles(allFiles)
}

function sortFiles(files) {
  return files.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function scanDailyFiles() {
  const manifestResults = await scanFromBuildManifest()
  if (manifestResults.length > 0) {
    return manifestResults
  }
  return await scanViaNetwork()
}

function extractTags(content) {
  const tags = []
  const tagPatterns = [
    { pattern: /AI|人工智能|Agent|LLM/i, tag: 'AI' },
    { pattern: /GitHub|开源项目/i, tag: 'GitHub' },
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

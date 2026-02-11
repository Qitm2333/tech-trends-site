import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, existsSync, statSync, readFileSync } from 'fs'
import { join, extname } from 'path'

// 递归复制目录
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }

  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

// 构建后复制 docs 的插件
function copyDocsToDist() {
  return {
    name: 'copy-docs-to-dist',
    closeBundle() {
      const srcDir = join(process.cwd(), 'docs')
      const destDir = join(process.cwd(), 'dist', 'docs')

      try {
        copyDir(srcDir, destDir)
        console.log('[copy-docs] ✅ 成功复制 docs 到 dist/docs')
      } catch (err) {
        console.error('[copy-docs] ❌ 复制失败:', err)
      }
    }
  }
}

// 开发服务器插件 - 服务 docs 目录
function serveDocsPlugin() {
  return {
    name: 'serve-docs',
    configureServer(server) {
      server.middlewares.use('/docs', (req, res, next) => {
        // 解码 URL，处理中文路径
        const decodedUrl = decodeURIComponent(req.url)
        const filePath = join(process.cwd(), 'docs', decodedUrl)

        console.log('[serve-docs] 请求:', decodedUrl, '-> 路径:', filePath)

        try {
          if (existsSync(filePath)) {
            const stat = statSync(filePath)

            if (stat.isFile()) {
              const content = readFileSync(filePath)
              const ext = extname(filePath).toLowerCase()

              // 根据文件类型设置 Content-Type
              let contentType = 'text/plain; charset=utf-8'
              if (ext === '.md') {
                contentType = 'text/markdown; charset=utf-8'
              } else if (ext === '.html') {
                contentType = 'text/html; charset=utf-8'
              } else if (ext === '.json') {
                contentType = 'application/json'
              }

              res.setHeader('Content-Type', contentType)
              res.end(content)
              console.log('[serve-docs] ✅ 成功服务文件:', decodedUrl)
              return
            } else if (stat.isDirectory()) {
              // 如果是目录，尝试返回 index.html
              const indexPath = join(filePath, 'index.html')
              if (existsSync(indexPath)) {
                const content = readFileSync(indexPath)
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(content)
                console.log('[serve-docs] ✅ 成功服务目录索引:', decodedUrl)
                return
              }
            }
          }
        } catch (e) {
          console.error('[serve-docs] ❌ 错误:', e.message)
        }

        // 文件不存在或出错，继续到下一个中间件
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/tech-trends-site/',
  plugins: [react(), serveDocsPlugin(), copyDocsToDist()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    copyPublicDir: true
  }
})

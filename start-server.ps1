# 简单的 PowerShell HTTP 服务器
$port = 3000
$root = Join-Path $PSScriptRoot "docs"

# 创建监听器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "服务器已启动！"
Write-Host "请访问: http://localhost:$port"
Write-Host "按 Ctrl+C 停止服务器"
Write-Host ""

# MIME 类型映射
$mimeTypes = @{
    ".html" = "text/html"
    ".htm" = "text/html"
    ".css" = "text/css"
    ".js" = "application/javascript"
    ".json" = "application/json"
    ".png" = "image/png"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif" = "image/gif"
    ".svg" = "image/svg+xml"
    ".ico" = "image/x-icon"
    ".md" = "text/markdown"
    ".txt" = "text/plain"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        
        $filePath = Join-Path $root $url.Substring(1)
        $filePath = [System.Web.HttpUtility]::UrlDecode($filePath)
        
        # 安全检查
        $fullRoot = (Resolve-Path $root).Path
        $fullPath = (Resolve-Path $filePath -ErrorAction SilentlyContinue).Path
        
        if ($fullPath -and $fullPath.StartsWith($fullRoot) -and (Test-Path $fullPath) -and (Get-Item $fullPath).PSIsContainer -eq $false) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }
            
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            
            Write-Host "200 $url" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $content = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            
            Write-Host "404 $url" -ForegroundColor Red
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "服务器已停止"
}

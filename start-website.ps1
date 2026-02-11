# Tech Trends 网站启动脚本
$NODE_PATH = "C:\Program Files\nodejs"
$NODE_EXE = "$NODE_PATH\node.exe"
$NPM_CMD = "$NODE_PATH\npm.cmd"

# 颜色设置
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

Write-Host "==========================================" -ForegroundColor $Cyan
Write-Host "   Tech Trends 网站启动器" -ForegroundColor $Cyan
Write-Host "==========================================" -ForegroundColor $Cyan
Write-Host ""

# 检查 Node.js
if (-not (Test-Path $NODE_EXE)) {
    Write-Host "[ERROR] 未找到 Node.js" -ForegroundColor $Red
    Write-Host "路径: $NODE_EXE" -ForegroundColor $Red
    Write-Host "请确保 Node.js 已正确安装" -ForegroundColor $Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "[OK] 找到 Node.js" -ForegroundColor $Green
Write-Host ""

# 切换到项目目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 检查 serve 包
if (-not (Test-Path "node_modules\serve")) {
    Write-Host "[INFO] 正在安装 serve 包..." -ForegroundColor $Yellow
    
    # 使用完整路径运行 npm
    $process = Start-Process -FilePath $NPM_CMD -ArgumentList "install", "serve" -Wait -PassThru -NoNewWindow
    
    if ($process.ExitCode -ne 0) {
        Write-Host "[ERROR] 安装失败" -ForegroundColor $Red
        Read-Host "按回车键退出"
        exit 1
    }
}

Write-Host "[OK] serve 包已就绪" -ForegroundColor $Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor $Cyan
Write-Host "   网站地址: http://localhost:3000" -ForegroundColor $Cyan
Write-Host "==========================================" -ForegroundColor $Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor $Yellow
Write-Host ""

# 启动服务器
$arguments = "node_modules\serve\build\main.js", "docs", "-p", "3000"
Start-Process -FilePath $NODE_EXE -ArgumentList $arguments -Wait -NoNewWindow

Write-Host ""
Write-Host "服务器已停止" -ForegroundColor $Yellow
Read-Host "按回车键退出"

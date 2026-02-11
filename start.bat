@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动 Tech Trends 开发服务器...
echo.
node node_modules\vite\bin\vite.js --port 3002
echo.
pause

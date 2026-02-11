@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在安装依赖...
node node_modules\npm\bin\npm-cli.js install
echo.
echo 安装完成！
pause

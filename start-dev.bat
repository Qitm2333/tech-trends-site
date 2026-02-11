@echo off
cd /d "%~dp0"
echo 启动开发服务器...
call npm run dev
echo.
pause

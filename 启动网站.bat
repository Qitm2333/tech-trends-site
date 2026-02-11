﻿﻿﻿﻿﻿@echo off
chcp 65001 >nul
cls
echo ==========================================
echo    Tech Trends Website Launcher
echo ==========================================
echo.

cd /d "%~dp0"

echo [INFO] Starting server...
echo.
echo ==========================================
echo    URL: http://localhost:3000
echo ==========================================
echo.
echo Press Ctrl+C to stop
echo.

npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start. Run: npm install
    pause
)
@echo off
echo Starting GoAI Platform UI...
echo.
echo UI will be available at:
echo   - Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop the UI server
echo.
cd /d "%~dp0\ui\console"
npm run dev

@echo off
echo Starting GoAI Platform...
echo.
echo Server will be available at:
echo   - API: http://localhost:8000
echo   - Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

@echo off
REM Start the FastAPI backend server on Windows

cd /d "%~dp0" || exit /b

echo.
echo 🚀 Starting AI Coding Assistant Backend...
echo.
echo 📋 Prerequisites:
echo    - Ollama running on http://localhost:11434
echo    - Model pulled: ollama pull qwen2.5-coder:3b
echo.

if not exist .env (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
)

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo.
echo ✅ Starting server...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

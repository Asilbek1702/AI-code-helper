#!/bin/bash
# Start the FastAPI backend server

cd "$(dirname "$0")" || exit

echo "🚀 Starting AI Coding Assistant Backend..."
echo ""
echo "📋 Prerequisites:"
echo "   - Ollama running on http://localhost:11434"
echo "   - Model pulled: ollama pull qwen2.5-coder:3b"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
fi

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Starting server..."
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

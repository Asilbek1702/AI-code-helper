# Complete Setup Guide

## Project Structure

```
AI code assistent/
├── frontend/                    # Next.js 14 app
│   ├── app/
│   │   ├── login/               # Login page
│   │   ├── chat/                # Chat interface
│   │   ├── projects/upload/     # File upload
│   │   ├── review/              # Code review
│   │   ├── globals.css          # Global styles + design tokens
│   │   └── layout.tsx           # Root layout
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local               # Frontend config
│
└── backend/                     # FastAPI service
    ├── app/
    │   ├── ai/                  # AI services
    │   │   ├── ollama_service.py
    │   │   ├── embeddings.py
    │   │   ├── chunker.py
    │   │   └── rag.py
    │   └── api/
    │       └── ai_routes.py     # API endpoints
    ├── tests/
    ├── main.py                  # FastAPI app
    ├── requirements.txt
    ├── .env
    ├── docker-compose.yml
    ├── README.md
    └── start.bat / start.sh
```

## Prerequisites

- **Node.js**: 18+ (for frontend)
- **Python**: 3.11+ (for backend)
- **Ollama**: Running locally with qwen2.5-coder:3b model
- **Git**: For version control

## Step 1: Install Ollama

### macOS / Linux
```bash
curl https://ollama.ai/install.sh | sh
ollama serve
```

### Windows
Download from https://ollama.ai and install.

Then in PowerShell:
```powershell
ollama serve
```

### Pull the Model
In another terminal:
```bash
ollama pull qwen2.5-coder:3b
```

Verify:
```bash
curl http://localhost:11434/api/tags
```

## Step 2: Setup Backend

### Navigate to backend
```bash
cd "c:\Users\User\Desktop\AI code assistent\backend"
```

### Create virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Configure environment
```bash
copy .env.example .env
# Edit .env if needed - defaults should work
```

### Run the backend
```bash
# Option 1: Using start script
start.bat  # Windows
./start.sh # Linux/Mac

# Option 2: Manual
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Verify backend
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","service":"ai-coding-assistant"}
```

## Step 3: Setup Frontend

### Navigate to frontend root
```bash
cd "c:\Users\User\Desktop\AI code assistent"
```

### Install dependencies
```bash
npm install
```

### Configure environment
```bash
# Create .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
```

### Run the frontend
```bash
npm run dev
```

### Access the app
Open http://localhost:3000 in your browser

## Step 4: Test Integration

### Backend Test
```bash
cd backend
python test_endpoints.py
```

### Frontend Test
1. Navigate to http://localhost:3000
2. Login (any email/password)
3. Try chat with the AI
4. Upload a project
5. Run code review

## Docker Setup (Alternative)

### Build and run with Docker Compose
```bash
cd backend
docker-compose up
```

This will start:
- Ollama service on port 11434
- Backend API on port 8000
- All databases and dependencies

Frontend still runs locally:
```bash
npm run dev
```

## Troubleshooting

### Ollama Connection Error
**Error**: `Connection refused to http://localhost:11434`

**Solution**:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start it
ollama serve

# If model not found
ollama pull qwen2.5-coder:3b
```

### Port Already in Use

**Backend (8000)**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000)**:
```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
rm -rf node_modules package-lock.json && npm install
```

### ChromaDB Errors
```bash
# Reset vector store
rm -rf backend/data/chroma
# Restart backend
```

## Development Workflow

### 1. Making Changes to Backend
```bash
cd backend

# Activate virtual env
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Backend auto-reloads with --reload flag
python -m uvicorn main:app --reload
```

### 2. Making Changes to Frontend
```bash
cd "c:\Users\User\Desktop\AI code assistent"

# Frontend auto-reloads during development
npm run dev
```

### 3. Testing Backend Endpoints
```bash
# Use the test script
cd backend
python test_endpoints.py

# Or use curl
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","stream":false}'

# Or use API docs
# Navigate to http://localhost:8000/docs
```

## Production Deployment

### Backend
```bash
# Build Docker image
docker build -t ai-assistant-backend .

# Run with Ollama
docker run -p 8000:8000 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  ai-assistant-backend

# Or use docker-compose
docker-compose -f docker-compose.yml up -d
```

### Frontend
```bash
# Build
npm run build

# Start production server
npm run start

# Or deploy to Vercel
vercel deploy
```

### Environment Variables for Production

**Backend (.env)**:
```
OLLAMA_BASE_URL=https://ollama.yourdomain.com
OLLAMA_MODEL=qwen2.5-coder:3b
CHROMA_PERSIST_DIR=/data/chroma
DEBUG=False
```

**Frontend (.env.production)**:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Monitoring

### Backend Logs
```bash
# View live logs
tail -f backend/logs/app.log

# Or check docker logs
docker logs -f ai-assistant-backend
```

### Frontend Logs
Check browser console (F12)

## Performance Tuning

### Backend
- Increase Ollama context if needed
- Cache embeddings for repeated queries
- Use batch processing for large files

### Frontend
- Enable next/image optimization
- Code splitting with dynamic imports
- Use SWR for data fetching

## Next Steps

1. **Integrate Authentication**
   - Add JWT tokens
   - Store sessions in database

2. **Add Database**
   - PostgreSQL for conversations
   - Store review history

3. **Implement File Upload**
   - Connect upload zone to backend
   - Process ZIP files

4. **Add Real-time Updates**
   - WebSocket for live collab
   - Real-time typing indicators

5. **Deploy to Production**
   - Use managed Ollama API
   - Deploy frontend to Vercel/Netlify
   - Set up monitoring and logging

## Support

- **Backend Issues**: Check `backend/logs/app.log`
- **Frontend Issues**: Check browser console (F12)
- **Ollama Issues**: Run `ollama serve` with debug flag
- **Database Issues**: Reset with `rm -rf backend/data/chroma`

## Useful Commands

```bash
# Backend
cd backend
pip install -r requirements.txt              # Install deps
pytest tests/                                # Run tests
python -m uvicorn main:app --reload         # Dev server
python -m uvicorn main:app --workers 4      # Production

# Frontend
npm install                                  # Install deps
npm run dev                                  # Dev server
npm run build                                # Build for production
npm run lint                                 # Check code quality

# Ollama
ollama serve                                 # Start service
ollama pull qwen2.5-coder:3b                # Pull model
ollama list                                  # List models
```

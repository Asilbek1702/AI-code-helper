# 🚀 Developer Quick Reference

## 🏃 Get Started in 5 Minutes

### Terminal 1: Ollama
```bash
ollama serve
# Verify: curl http://localhost:11434/api/tags
```

### Terminal 2: Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload
# Backend at: http://localhost:8000
# Docs at: http://localhost:8000/docs
```

### Terminal 3: Frontend
```bash
npm install
npm run dev
# App at: http://localhost:3000
```

---

## 📍 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js app |
| Backend | http://localhost:8000 | FastAPI |
| Ollama | http://localhost:11434 | LLM |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health | http://localhost:8000/health | Status check |

---

## 🎨 Frontend Paths

| Page | Path | Component |
|------|------|-----------|
| Login | `/login` | `app/login/page.tsx` |
| Chat | `/chat` | `app/chat/page.tsx` |
| Upload | `/projects/upload` | `app/projects/upload/page.tsx` |
| Review | `/review` | `app/review/page.tsx` |

---

## 🔌 API Endpoints Quick Ref

### Chat (Streaming)
```bash
POST /api/ai/chat
{
  "message": "Your question",
  "context": "Optional code",
  "stream": true
}
```

### Debug (Find bugs)
```bash
POST /api/ai/debug
{
  "code": "const x = null;",
  "language": "typescript",
  "error": "Error message"
}
```

### Review (Code review)
```bash
POST /api/ai/review
{
  "code": "function foo() {}",
  "language": "typescript",
  "focus_areas": ["performance"]
}
```

### RAG Query (Context search)
```bash
POST /api/ai/rag-query
{
  "query": "How to handle async?",
  "top_k": 3,
  "stream": true
}
```

### Add Context
```bash
POST /api/ai/context/add
{
  "code": "Your code",
  "language": "typescript",
  "filename": "src/file.ts"
}
```

---

## 🧠 Design Tokens

```css
/* Colors */
--bg-primary: #0a0a0f
--bg-secondary: #111118
--bg-tertiary: #1a1a24
--accent-cyan: #00d4ff
--text-primary: #e8e8ed
--text-secondary: #8a8a9a
--text-muted: #5a5a6a

/* Glass Effect */
.glass {
  background: rgba(17, 17, 24, 0.65);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## 📁 Important Files

### Frontend
- `app/globals.css` - Design tokens + glass utility
- `tailwind.config.ts` - Theme config
- `components/AssistantLayout.tsx` - Sidebar + topbar
- `components/ChatMessage.tsx` - Message UI
- `components/CodeBlock.tsx` - Code display

### Backend
- `app/ai/ollama_service.py` - LLM connection
- `app/ai/embeddings.py` - Vector store (ChromaDB)
- `app/ai/chunker.py` - Code splitting
- `app/ai/rag.py` - RAG implementation
- `app/api/ai_routes.py` - API endpoints

---

## 🔧 Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:3b
CHROMA_PERSIST_DIR=./data/chroma
DEBUG=True
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Connection refused" | `ollama serve` not running |
| Port 8000 in use | `lsof -ti:8000 \| xargs kill -9` |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Module not found | `pip install -r requirements.txt` |
| ChromaDB error | `rm -rf backend/data/chroma` |
| Model not found | `ollama pull qwen2.5-coder:3b` |

---

## ✨ Component Tree

```
App (layout.tsx)
├─ AssistantLayout
│  ├─ Sidebar (nav + user menu)
│  ├─ TopBar (model selector + buttons)
│  └─ Main Content
│     ├─ Login Page
│     │  └─ AuthCard (glass panel)
│     ├─ Chat Page
│     │  ├─ ChatMessage (user/AI bubbles)
│     │  ├─ CodeBlock (syntax highlighted)
│     │  └─ ChatInput (with file attach)
│     ├─ Upload Page
│     │  ├─ UploadZone (drag-drop)
│     │  ├─ FileTree (file browser)
│     │  └─ ProjectSettings (form)
│     └─ Review Page
│        ├─ FileNavigator (left panel)
│        ├─ DiffView (code diff)
│        └─ InlineComment (comments)
```

---

## 📊 Service Layers

```
Frontend (Next.js)
    ↓ HTTP/SSE ↓
API Router (FastAPI)
    ↓
AI Services:
├─ OllamaService (LLM)
├─ EmbeddingsService (Vector DB)
├─ CodeChunker (Text Processing)
└─ RAGService (Retrieval)
    ↓
External:
├─ Ollama (localhost:11434)
├─ ChromaDB (./data/chroma)
└─ SentenceTransformers (cached)
```

---

## 🚀 Build & Deploy Commands

### Frontend
```bash
npm run dev        # Development
npm run build      # Production build
npm run start      # Run production
npm run lint       # Type check
```

### Backend
```bash
# Development
python -m uvicorn main:app --reload

# Production
python -m uvicorn main:app --workers 4

# Testing
pytest tests/
python test_endpoints.py

# Docker
docker-compose up -d
docker-compose logs -f backend
```

---

## 🔍 Testing

### Test Backend Endpoints
```bash
cd backend
python test_endpoints.py
```

### Test Individual Endpoint
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","stream":false}'
```

### Test Frontend
1. Go to http://localhost:3000
2. Login (any email/password)
3. Test each page

---

## 📝 Adding New Features

### Add API Endpoint
1. Add function to `app/api/ai_routes.py`
2. Use `@router.post()` decorator
3. Define request/response models
4. Test with `curl` or API docs

### Add Frontend Component
1. Create in `components/`
2. Export from component
3. Import in page
4. Test styling with design tokens

### Add Service
1. Create new file in `app/ai/`
2. Import existing services
3. Implement async methods
4. Use in routes

---

## 📚 Documentation

- `README.md` - Project overview
- `SETUP.md` - Installation guide
- `BUILD_SUMMARY.md` - What was built
- `backend/README.md` - Backend docs
- `backend/API_REFERENCE.md` - All endpoints
- `backend/ARCHITECTURE.md` - System design
- `backend/INTEGRATION_EXAMPLE.md` - Frontend integration

---

## 🎯 Performance Tips

### Frontend
- Use `React.memo()` for heavy components
- Import only what you need
- Use dynamic imports for code-split

### Backend
- Cache embeddings for repeated queries
- Batch process multiple chunks
- Use streaming for long responses
- Monitor ChromaDB size

### Ollama
- Keep model size manageable (~3B params)
- Adjust temperature for consistency
- Use context window wisely

---

## 🔐 Security Checklist

- ✅ Environment variables for secrets
- ✅ CORS properly configured
- ✅ Input validation via Pydantic
- ⚠️ TODO: Add authentication
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Use HTTPS in production

---

## 🎨 Styling Cheatsheet

```css
/* Typography */
font-family: var(--font-inter)  /* UI text */
font-family: var(--font-mono)   /* Code text */

/* Colors */
bg-bg-primary    /* Main background */
text-text-primary /* Main text */
bg-accent-cyan   /* Primary action */

/* Glass Effect */
.glass          /* Frosted panel */

/* Responsive */
hidden lg:flex   /* Hide on mobile, show on large */
grid-cols-2      /* 2-column on desktop */
```

---

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive

---

## 📞 Getting Help

1. **Check logs**: `backend/logs/app.log`
2. **API docs**: http://localhost:8000/docs
3. **Console**: F12 in browser
4. **Read docs**: See `backend/*.md` files

---

## 🎊 You're All Set!

Everything is configured and ready. Just run:
```bash
# Terminal 1
ollama serve

# Terminal 2
cd backend && python -m uvicorn main:app --reload

# Terminal 3
npm run dev

# Then open: http://localhost:3000
```

Happy coding! 🚀

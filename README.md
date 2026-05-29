# AI Coding Assistant - Complete Application

A full-stack AI-powered coding assistant with Next.js frontend and FastAPI backend.

## 🎯 Features

### Frontend (Next.js 14)
- **Login Page**: Glass-morphism auth UI with sign-in/register
- **Chat Interface**: Real-time conversation with AI assistant
- **Code Upload**: Drag-drop ZIP uploads with file tree viewer
- **Code Review**: Visual diff view with inline comments
- **Design System**: Tailwind CSS + shadcn/ui + Framer Motion
- **Dark Theme**: Eye-friendly developer-centric UI

### Backend (FastAPI)
- **Ollama Integration**: Local LLM with qwen2.5-coder:3b
- **RAG System**: Code context retrieval and augmentation
- **Embeddings**: SentenceTransformers + ChromaDB
- **Streaming**: Server-Sent Events for real-time responses
- **Code Analysis**: Chat, debug, review, and RAG query endpoints

## 🚀 Quick Start

### 1. Start Ollama
```bash
# macOS/Linux
ollama serve

# Windows (from PowerShell)
ollama serve

# Pull model (in another terminal)
ollama pull qwen2.5-coder:3b
```

### 2. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 3. Start Frontend
```bash
cd "c:\Users\User\Desktop\AI code assistent"
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## 📁 Project Structure

```
c:\Users\User\Desktop\AI code assistent\
├── app/                           # Next.js 14 App Router
│   ├── login/page.tsx            # Auth UI
│   ├── chat/page.tsx             # Chat interface
│   ├── projects/upload/page.tsx  # File upload
│   ├── review/page.tsx           # Code review
│   ├── globals.css               # Design tokens + glass utility
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── AssistantLayout.tsx       # Sidebar + topbar
│   ├── ChatMessage.tsx           # Message bubbles
│   ├── ChatInput.tsx             # Chat input field
│   ├── CodeBlock.tsx             # Syntax-highlighted code
│   ├── UploadZone.tsx            # Drag-drop upload
│   ├── FileTree.tsx              # File browser
│   ├── ProjectSettings.tsx       # Upload settings
│   ├── FileNavigator.tsx         # Review file list
│   ├── DiffView.tsx              # Code diff viewer
│   └── InlineComment.tsx         # Review comments
│
├── lib/utils.ts                  # Tailwind utilities
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.js
└── README.md
```

```
backend/
├── app/
│   ├── ai/
│   │   ├── ollama_service.py     # LLM integration
│   │   ├── embeddings.py         # ChromaDB + embeddings
│   │   ├── chunker.py            # Code splitting
│   │   └── rag.py                # RAG implementation
│   └── api/
│       └── ai_routes.py          # FastAPI routes
│
├── tests/test_services.py        # Unit tests
├── main.py                       # FastAPI app
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── start.sh / start.bat
├── test_endpoints.py
├── README.md
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── INTEGRATION_EXAMPLE.md
└── SETUP.md
```

## 🎨 Design Highlights

### Color Palette
- **Background Primary**: `#0a0a0f` (deep near-black)
- **Accent Cyan**: `#00d4ff` (primary actions)
- **Text Primary**: `#e8e8ed` (readable white)
- **Glass**: `rgba(17, 17, 24, 0.65)` with blur and glow

### Components
- Glassmorphism panels with backdrop blur
- Smooth Framer Motion animations
- Responsive sidebar with collapsing
- Streaming code with line numbers
- Real-time typing indicators

### Fonts
- **UI**: Inter (Google Fonts)
- **Code**: JetBrains Mono (Google Fonts)

## 🔌 API Endpoints

### Chat
```bash
POST /api/ai/chat
{
  "message": "How to optimize React?",
  "context": "Optional code",
  "stream": true
}
```

### Debug
```bash
POST /api/ai/debug
{
  "code": "const x = null;",
  "language": "typescript",
  "error": "NPE error"
}
```

### Review
```bash
POST /api/ai/review
{
  "code": "function test() { ... }",
  "language": "typescript",
  "focus_areas": ["performance"]
}
```

### RAG Query
```bash
POST /api/ai/rag-query
{
  "query": "How do we handle async?",
  "top_k": 3,
  "stream": true
}
```

See [API_REFERENCE.md](backend/API_REFERENCE.md) for complete docs.

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- Google Fonts (Inter, JetBrains Mono)

### Backend
- FastAPI
- Python 3.11
- LangChain
- Ollama (qwen2.5-coder:3b)
- ChromaDB
- SentenceTransformers (all-MiniLM-L6-v2)

### Infrastructure
- Node.js (frontend)
- Docker & Docker Compose (optional)
- PostCSSautoprefixer

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

## 📖 Documentation

- [Setup Guide](SETUP.md) - Complete installation instructions
- [Backend README](backend/README.md) - API documentation
- [API Reference](backend/API_REFERENCE.md) - Endpoint details
- [Architecture](backend/ARCHITECTURE.md) - System design
- [Integration Examples](backend/INTEGRATION_EXAMPLE.md) - Frontend integration

## ✨ Features In Progress

- [ ] Database integration (PostgreSQL)
- [ ] User authentication (JWT)
- [ ] Conversation history
- [ ] Project file uploads (actual ZIP processing)
- [ ] Real-time collaboration
- [ ] Code snippets library
- [ ] Performance metrics dashboard

## 🐛 Known Limitations

- Ollama responses are simulated streaming (chunked)
- RAG requires manual code context addition
- No persistent user data
- Local-only deployment (no cloud)
- Single-user mode

## 📝 Development

### Frontend
```bash
cd c:\Users\User\Desktop\AI code assistent
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # Type check
```

### Backend
```bash
cd backend
python -m uvicorn main:app --reload     # Dev server
pytest tests/                            # Run tests
python test_endpoints.py                 # Integration tests
```

## 🚀 Deployment

### Docker
```bash
cd backend
docker-compose up -d
cd ..
npm run build && npm start
```

### Production
See [SETUP.md](SETUP.md#production-deployment)

## 📞 Support

- Check logs: `backend/logs/app.log`
- Test endpoints: `python backend/test_endpoints.py`
- API docs: http://localhost:8000/docs

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for developers

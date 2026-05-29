# AI Coding Assistant - Backend

FastAPI service for AI-powered code analysis using Ollama and RAG.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Note: the file is named `requirements.txt`.

### 2. Configure Ollama

Ensure Ollama is running locally:

```bash
# Install Ollama from https://ollama.ai
# Start Ollama service
ollama serve

# In another terminal, pull the model
ollama pull qwen2.5-coder:3b
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:3b
CHROMA_PERSIST_DIR=./data/chroma
DEBUG=True
```

## Running

### Development

```bash
# With hot reload
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
# Without reload
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Chat
```bash
POST /api/ai/chat
Content-Type: application/json

{
  "message": "How can I optimize this React component?",
  "context": "Optional code or context",
  "stream": true
}
```

### Debug Analysis
```bash
POST /api/ai/debug
Content-Type: application/json

{
  "code": "const x = null; console.log(x.property);",
  "language": "typescript",
  "error": "Cannot read property 'property' of null",
  "traceback": "Optional traceback",
  "stream": true
}
```

### Code Review
```bash
POST /api/ai/review
Content-Type: application/json

{
  "code": "// Your code here",
  "language": "typescript",
  "focus_areas": ["performance", "security"],
  "stream": true
}
```

### RAG Query
```bash
POST /api/ai/rag-query
Content-Type: application/json

{
  "query": "How to handle async operations?",
  "top_k": 3,
  "stream": true
}
```

### Add Code Context
```bash
POST /api/ai/context/add
Content-Type: application/json

{
  "code": "// Your code here",
  "language": "typescript",
  "filename": "src/utils.ts"
}
```

### Clear Context
```bash
POST /api/ai/context/clear
```

### Status
```bash
GET /api/ai/status
```

### Health Check
```bash
GET /health
```

## Architecture

- **OllamaService**: Connects to Ollama LLM with streaming support
- **EmbeddingsService**: Generates embeddings using SentenceTransformers and stores in ChromaDB
- **CodeChunker**: Splits code by function/class boundaries or fixed line count
- **RAGService**: Implements retrieval-augmented generation by combining context retrieval with LLM generation
- **FastAPI Routes**: Async endpoints with streaming responses

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── README.md              # This file
└── app/
    ├── __init__.py
    ├── ai/
    │   ├── __init__.py
    │   ├── ollama_service.py    # Ollama LLM integration
    │   ├── embeddings.py        # Embeddings + ChromaDB
    │   ├── chunker.py           # Code chunking logic
    │   └── rag.py               # RAG implementation
    └── api/
        ├── __init__.py
        └── ai_routes.py         # FastAPI routes
```

## Performance Notes

- Ollama responses use LangChain streaming and are returned as Server-Sent Events
- SentenceTransformers embeddings are CPU-based (4-5MB model)
- ChromaDB with DuckDB backend for local persistence
- All endpoints are async for better concurrency

## Troubleshooting

### Ollama Connection Failed
- Ensure Ollama is running: `ollama serve`
- Check OLLAMA_BASE_URL in .env
- Model must be pulled: `ollama pull qwen2.5-coder:3b`

### ChromaDB Errors
- Delete `./data/chroma` and restart to reset the database
- Ensure write permissions in working directory

### Memory Issues
- Reduce batch size in embeddings_service
- Use smaller embedding model if needed

# AI Coding Assistant Backend - Architecture

## Overview

The backend is a FastAPI service that provides AI-powered code analysis using:
- **Ollama**: Local LLM running qwen2.5-coder:3b
- **LangChain**: LLM framework for easy integration
- **ChromaDB**: Vector database for RAG (Retrieval-Augmented Generation)
- **SentenceTransformers**: Embeddings model (all-MiniLM-L6-v2)

## Components

### 1. Ollama Service (`app/ai/ollama_service.py`)

**Responsibility**: Manage LLM interactions

**Key Features**:
- Connect to local Ollama instance
- Stream responses with chunk-based simulation
- System prompt: Senior coding assistant persona
- Error handling for connection failures

**API**:
```python
class OllamaService:
    async def stream_response(prompt: str, context: str) -> AsyncGenerator[str, None]
    async def generate_response(prompt: str, context: str) -> str
```

### 2. Embeddings Service (`app/ai/embeddings.py`)

**Responsibility**: Generate embeddings and manage vector store

**Key Features**:
- Load SentenceTransformers model (all-MiniLM-L6-v2) - 22MB
- Generate embeddings for code chunks
- Store in ChromaDB with persistence
- Search with similarity scoring

**API**:
```python
class EmbeddingsService:
    def embed_text(text: str) -> List[float]
    def embed_batch(texts: List[str]) -> List[List[float]]
    def add_chunks(chunks: List[dict]) -> None
    def search(query: str, top_k: int) -> List[dict]
    def clear_collection() -> None
```

### 3. Code Chunker (`app/ai/chunker.py`)

**Responsibility**: Split code into meaningful chunks

**Strategies**:
- **Boundaries**: Split by function/class definitions
  - Regex patterns for Python, TypeScript, JavaScript
  - Preserves semantic units
  
- **Lines**: Fixed-size chunks with overlap
  - Default: 50 lines per chunk, 10 lines overlap
  - Fallback when boundary detection fails

**API**:
```python
class CodeChunker:
    @staticmethod
    def split_by_boundaries(content: str, language: str) -> List[Tuple[str, int]]
    @staticmethod
    def split_by_lines(content: str, lines_per_chunk: int, overlap: int) -> List[Tuple[str, int]]
    @staticmethod
    def chunk_code(content: str, language: str, strategy: str) -> List[dict]
```

### 4. RAG Service (`app/ai/rag.py`)

**Responsibility**: Implement Retrieval-Augmented Generation

**Flow**:
1. Embed user query
2. Search ChromaDB for similar code chunks (top-3)
3. Build context from retrieved chunks
4. Inject context into LLM prompt
5. Stream response from Ollama

**API**:
```python
class RAGService:
    async def query(query: str, top_k: int, stream: bool) -> AsyncGenerator[str, None] | str
    async def add_code_context(code: str, language: str, metadata: dict) -> None
    async def clear_context() -> None
```

### 5. API Routes (`app/api/ai_routes.py`)

**Endpoints**:
- `POST /api/ai/chat` - General chat with optional context
- `POST /api/ai/debug` - Error analysis with code
- `POST /api/ai/review` - Code review with focus areas
- `POST /api/ai/rag-query` - Query using RAG
- `POST /api/ai/context/add` - Add code to vector store
- `POST /api/ai/context/clear` - Clear vector store
- `GET /api/ai/status` - Service status
- `GET /health` - Health check

## Data Flow Diagrams

### Chat Flow
```
User Query
    ↓
OllamaService.stream_response(query)
    ↓
Ollama LLM
    ↓
Chunked Response
    ↓
FastAPI StreamingResponse
    ↓
Client (SSE)
```

### RAG Flow
```
User Query
    ↓
EmbeddingsService.embed_text(query)
    ↓
ChromaDB.search()
    ↓
Top-3 Code Chunks
    ↓
Build Context
    ↓
OllamaService.stream_response(query, context)
    ↓
LLM Response with Context
    ↓
Client
```

### Add Context Flow
```
Code File
    ↓
CodeChunker.chunk_code()
    ↓
Chunks with Metadata
    ↓
EmbeddingsService.embed_batch()
    ↓
Embeddings
    ↓
ChromaDB.add()
    ↓
Persisted Vector Store
```

## Configuration

### Environment Variables
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:3b
CHROMA_PERSIST_DIR=./data/chroma
DEBUG=True
```

### Ollama Model
- **Model**: qwen2.5-coder:3b
- **Size**: ~2GB
- **Context**: 4K tokens
- **Specialization**: Code generation and analysis

### Embeddings Model
- **Model**: all-MiniLM-L6-v2
- **Size**: 22MB
- **Dimension**: 384
- **Performance**: Fast CPU inference

## Performance Characteristics

### Ollama Response
- First token latency: 1-3 seconds
- Throughput: ~50-100 tokens/second (CPU)
- Streaming: Simulated via chunking

### Embeddings
- Batch size: 100 texts
- Speed: ~2000 texts/second (CPU)
- Dimension: 384

### ChromaDB Search
- Query embedding: <1ms
- Search (1000 docs): 5-10ms
- Add batch (100 docs): 50-100ms

## Error Handling

### Ollama Connection
- Retry with exponential backoff
- Fallback error message to client
- Logs detailed error information

### Embeddings Errors
- Graceful degradation (empty search results)
- Logged for debugging
- Non-blocking (doesn't crash service)

### ChromaDB Errors
- Collection auto-creation
- Delete and recreate on corruption
- Persistent storage is optional

## Testing

### Unit Tests
```bash
pytest tests/
```

### Integration Tests
```bash
python test_endpoints.py
```

### Load Testing
```bash
locust -f locustfile.py --host http://localhost:8000
```

## Deployment

### Local Development
```bash
./start.sh  # Linux/Mac
start.bat   # Windows
```

### Docker
```bash
docker-compose up
```

### Production
- Use 4+ workers
- Load balancer (nginx)
- Monitoring (Prometheus)
- Logging (ELK stack)

## Future Enhancements

1. **Multi-model support**: Switch between qwen, mistral, llama
2. **Fine-tuning**: Fine-tune Ollama model on custom code
3. **Caching**: Cache embeddings and responses
4. **Semantic versioning**: Track code version in RAG
5. **Async batch processing**: Queue for large files
6. **Webhooks**: Event notifications for analysis

# API Quick Reference

## Base URL
```
http://localhost:8000/api/ai
```

## Authentication
Currently no authentication required (add in production)

## Response Format

### Streaming Responses
- Content-Type: `text/event-stream`
- Returns chunks of text as they're generated
- Keep connection open until stream ends

### Non-Streaming Responses
- Content-Type: `application/json`
- Returns complete response in `{ "response": "..." }`

## Endpoints

### 1. Chat
**POST** `/api/ai/chat`

General conversation with AI assistant.

**Request:**
```json
{
  "message": "How do I optimize React performance?",
  "context": "Optional code or context",
  "stream": true
}
```

**Response (streaming):**
```
Here are some ways to optimize React performance...
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","stream":false}'
```

---

### 2. Debug
**POST** `/api/ai/debug`

Analyze code errors and suggest fixes.

**Request:**
```json
{
  "code": "const obj = null; console.log(obj.property);",
  "language": "typescript",
  "error": "Cannot read property 'property' of null",
  "traceback": "Optional traceback info",
  "stream": true
}
```

**Response:**
```
The issue is that `obj` is null. Before accessing properties...
```

---

### 3. Review
**POST** `/api/ai/review`

Perform comprehensive code review.

**Request:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "typescript",
  "focus_areas": ["performance", "security", "style"],
  "stream": true
}
```

**Response:**
```
Code Review:

1. Performance: ✓ No issues
2. Security: ✓ Safe
...
```

**Focus Areas (optional):**
- performance
- security
- style
- maintainability
- testing
- documentation

---

### 4. RAG Query
**POST** `/api/ai/rag-query`

Query using context from uploaded code.

**Request:**
```json
{
  "query": "How do we handle async operations?",
  "top_k": 3,
  "stream": true
}
```

**Response:**
```
Retrieved relevant code:

[Chunk 1 - typescript:45]
async function fetchData() {
  ...
}

Based on the code, here's how async operations are handled...
```

---

### 5. Add Context
**POST** `/api/ai/context/add`

Upload code to RAG context for later queries.

**Request:**
```json
{
  "code": "// Your code here",
  "language": "typescript",
  "filename": "src/utils.ts"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Code context added"
}
```

**Supported Languages:**
- typescript / javascript
- python
- java
- go
- rust
- cpp / c

---

### 6. Clear Context
**POST** `/api/ai/context/clear`

Remove all uploaded code from RAG context.

**Request:** (no body)

**Response:**
```json
{
  "status": "success",
  "message": "Context cleared"
}
```

---

### 7. Status
**GET** `/api/ai/status`

Get AI service configuration and status.

**Response:**
```json
{
  "status": "running",
  "ollama_url": "http://localhost:11434",
  "model": "qwen2.5-coder:3b",
  "embeddings_model": "all-MiniLM-L6-v2",
  "vector_store": "ChromaDB"
}
```

---

### 8. Health Check
**GET** `/health`

Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "ai-coding-assistant"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request format"
}
```

### 500 Server Error
```json
{
  "detail": "Chat failed: Connection to Ollama failed"
}
```

## Streaming Implementation

### Using Fetch API
```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello', stream: true })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log(chunk);
}
```

### Using EventSource (SSE)
```javascript
const eventSource = new EventSource('/api/ai/chat?message=Hello');

eventSource.onmessage = (event) => {
  console.log('Chunk:', event.data);
};

eventSource.onerror = () => {
  eventSource.close();
};
```

## Rate Limiting
Not implemented (add in production)

## CORS
Enabled for localhost (update for production)

## Timeouts
- Default: 30 seconds
- Streaming responses are kept alive

## Best Practices

1. **Always specify language** for code-related endpoints
2. **Use streaming** for long responses to improve UX
3. **Cache context** by filename to avoid re-uploading
4. **Handle connection errors** gracefully
5. **Implement rate limiting** in production
6. **Log all errors** for debugging
7. **Validate input** before sending

## Example: Complete Flow

```javascript
// 1. Add project context
await fetch('/api/ai/context/add', {
  method: 'POST',
  body: JSON.stringify({
    code: fs.readFileSync('src/main.ts', 'utf-8'),
    language: 'typescript',
    filename: 'src/main.ts'
  })
});

// 2. Query with RAG
const response = await fetch('/api/ai/rag-query', {
  method: 'POST',
  body: JSON.stringify({
    query: 'How do we initialize the app?',
    stream: true
  })
});

// 3. Process streaming response
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}
```

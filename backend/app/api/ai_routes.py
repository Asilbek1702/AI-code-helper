from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.ai.ollama_service import OllamaConnectionError, ollama_service, settings
from app.ai.rag import rag_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    stream: bool = True


class DebugRequest(BaseModel):
    code: str
    error: str
    language: str = "typescript"
    traceback: Optional[str] = None
    stream: bool = True


class ReviewRequest(BaseModel):
    code: str
    language: str = "typescript"
    focus_areas: list[str] = Field(default_factory=list)
    stream: bool = True


class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=10)
    stream: bool = True


class CodeContextRequest(BaseModel):
    code: str
    language: str = "typescript"
    filename: Optional[str] = None


def sse_response(generator) -> StreamingResponse:
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/chat")
async def chat(request: ChatRequest):
    if request.stream:
        return sse_response(ollama_service.stream_sse(request.message, request.context or ""))

    try:
        response = await ollama_service.generate_response(request.message, request.context or "")
        return {"response": response}
    except OllamaConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/debug")
async def debug(request: DebugRequest):
    prompt = f"""Analyze this traceback/error and propose the most likely fix.

Language: {request.language}

Code:
```{request.language}
{request.code}
```

Error:
{request.error}
"""
    if request.traceback:
        prompt += f"\nTraceback:\n{request.traceback}\n"

    if request.stream:
        return sse_response(ollama_service.stream_sse(prompt))

    try:
        response = await ollama_service.generate_response(prompt)
        return {"response": response}
    except OllamaConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/review")
async def review(request: ReviewRequest):
    focus = ", ".join(request.focus_areas) if request.focus_areas else "correctness, maintainability, security, performance, and tests"
    prompt = f"""Review this code as a senior engineer.
Prioritize concrete findings with severity, line references when possible, and suggested fixes.
Focus areas: {focus}

```{request.language}
{request.code}
```"""

    if request.stream:
        return sse_response(ollama_service.stream_sse(prompt))

    try:
        response = await ollama_service.generate_response(prompt)
        return {"response": response}
    except OllamaConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/rag-query")
async def rag_query(request: RAGQueryRequest):
    if request.stream:
        return sse_response(rag_service.query_sse(request.query, top_k=request.top_k))

    try:
        response = await rag_service.query_text(request.query, top_k=request.top_k)
        return {"response": response}
    except OllamaConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/context/add")
async def add_context(request: CodeContextRequest):
    try:
        count = await rag_service.add_code_context(
            request.code,
            request.language,
            {"filename": request.filename} if request.filename else None,
        )
        return {"status": "success", "chunks_added": count}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to add context: {exc}") from exc


@router.post("/context/clear")
async def clear_context():
    try:
        await rag_service.clear_context()
        return {"status": "success"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to clear context: {exc}") from exc


@router.get("/status")
async def status():
    return {
        "status": "running",
        "ollama_url": settings.ollama_base_url,
        "model": settings.ollama_model,
        "embeddings_model": "all-MiniLM-L6-v2",
        "vector_store": "ChromaDB",
    }

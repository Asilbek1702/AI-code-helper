from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import AsyncSessionLocal, get_db
from app.ai.ollama_service import ollama_service
from app.models.user import User
from app.schemas.chat import ChatAIRequest, ChatCreate, ChatHistoryResponse, ChatResponse, MessageCreate, MessageResponse
from app.services.chat_service import create_chat, get_chat_history, save_message

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def create_chat_route(
    payload: ChatCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await create_chat(db, current_user, payload.title)


@router.post("/messages", response_model=MessageResponse)
async def save_chat_message(
    payload: MessageCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await save_message(
        db,
        current_user,
        role=payload.role,
        content=payload.content,
        chat_id=payload.chat_id,
        title=payload.title,
    )


@router.post("/stream")
async def persisted_chat_stream(
    payload: ChatAIRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    user_message = await save_message(
        db,
        current_user,
        role="user",
        content=payload.message,
        chat_id=payload.chat_id,
        title=payload.title,
    )

    async def response_generator():
        assistant_chunks: list[str] = []
        async for event in ollama_service.stream_sse(payload.message, payload.context or ""):
            if event.startswith("event: token"):
                marker = '"content": '
                if marker in event:
                    assistant_chunks.append(event)
            yield event

        assistant_text = _extract_sse_content(assistant_chunks)
        if assistant_text:
            async with AsyncSessionLocal() as stream_db:
                stream_user = await stream_db.get(User, current_user.id)
                if stream_user:
                    await save_message(
                        stream_db,
                        stream_user,
                        role="assistant",
                        content=assistant_text,
                        chat_id=user_message.chat_id,
                    )

    return StreamingResponse(
        response_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/history", response_model=ChatHistoryResponse)
async def history(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    chat_id: str = Query(...),
):
    chat, messages = await get_chat_history(db, current_user, chat_id)
    return {"chat": chat, "messages": messages}


def _extract_sse_content(events: list[str]) -> str:
    import json

    parts: list[str] = []
    for event in events:
        for line in event.splitlines():
            if line.startswith("data: "):
                try:
                    payload = json.loads(line.removeprefix("data: "))
                except json.JSONDecodeError:
                    continue
                content = payload.get("content")
                if content:
                    parts.append(content)
    return "".join(parts)

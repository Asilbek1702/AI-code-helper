from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.chat import Chat
from app.models.message import Message
from app.models.user import User


async def create_chat(db: AsyncSession, user: User, title: str = "New Chat") -> Chat:
    chat = Chat(user_id=user.id, title=title)
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat


async def save_message(
    db: AsyncSession,
    user: User,
    role: str,
    content: str,
    chat_id: str | None = None,
    title: str | None = None,
) -> Message:
    chat = await _get_or_create_chat(db, user, chat_id, title)
    message = Message(chat_id=chat.id, user_id=user.id, role=role, content=content)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def get_chat_history(db: AsyncSession, user: User, chat_id: str) -> tuple[Chat, list[Message]]:
    chat = await db.scalar(
        select(Chat)
        .where(Chat.id == chat_id, Chat.user_id == user.id)
        .options(selectinload(Chat.messages))
    )
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    return chat, list(chat.messages)


async def _get_or_create_chat(
    db: AsyncSession,
    user: User,
    chat_id: str | None,
    title: str | None,
) -> Chat:
    if chat_id:
        chat = await db.scalar(select(Chat).where(Chat.id == chat_id, Chat.user_id == user.id))
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
        return chat

    chat = Chat(user_id=user.id, title=title or "New Chat")
    db.add(chat)
    await db.flush()
    return chat

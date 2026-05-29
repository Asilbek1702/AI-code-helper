from datetime import datetime

from pydantic import BaseModel, Field


class ChatCreate(BaseModel):
    title: str = Field(default="New Chat", max_length=255)


class MessageCreate(BaseModel):
    chat_id: str | None = None
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str = Field(min_length=1)
    title: str | None = Field(default=None, max_length=255)


class ChatAIRequest(BaseModel):
    message: str = Field(min_length=1)
    chat_id: str | None = None
    context: str | None = None
    title: str | None = Field(default=None, max_length=255)


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    chat: ChatResponse
    messages: list[MessageResponse]

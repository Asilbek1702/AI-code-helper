import json
import os
from typing import AsyncGenerator

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from pydantic_settings import BaseSettings

try:
    from langchain_ollama import ChatOllama
except ImportError:
    from langchain_community.chat_models import ChatOllama


class Settings(BaseSettings):
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:3b")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

SYSTEM_PROMPT = """You are a senior coding assistant.
Be precise, practical, and direct. Help with implementation, debugging, refactoring, architecture, tests, and code review. Prefer concrete code-level guidance, call out risks clearly, and explain tradeoffs only when they matter."""


class OllamaConnectionError(RuntimeError):
    """Raised when Ollama cannot be reached or fails during generation."""


class OllamaService:
    """Async ChatOllama wrapper with SSE-friendly streaming."""

    def __init__(self) -> None:
        self.llm = ChatOllama(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model,
            temperature=0.2,
        )

    def build_messages(self, prompt: str, context: str = "") -> list[BaseMessage]:
        user_prompt = prompt
        if context.strip():
            user_prompt = f"""Use this context when it is relevant:

{context}

User request:
{prompt}"""

        return [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt),
        ]

    async def stream_response(self, prompt: str, context: str = "") -> AsyncGenerator[str, None]:
        """Stream raw token chunks from Ollama."""
        try:
            async for chunk in self.llm.astream(self.build_messages(prompt, context)):
                content = getattr(chunk, "content", "")
                if content:
                    yield content
        except Exception as exc:
            raise OllamaConnectionError(
                f"Failed to connect to Ollama at {settings.ollama_base_url}. "
                f"Ensure Ollama is running and model '{settings.ollama_model}' is pulled."
            ) from exc

    async def stream_sse(self, prompt: str, context: str = "") -> AsyncGenerator[str, None]:
        """Stream response as Server-Sent Events."""
        try:
            async for chunk in self.stream_response(prompt, context):
                yield self._sse("token", {"content": chunk})
            yield self._sse("done", {"status": "complete"})
        except OllamaConnectionError as exc:
            yield self._sse("error", {"message": str(exc)})

    async def generate_response(self, prompt: str, context: str = "") -> str:
        """Generate a complete response from Ollama."""
        try:
            response = await self.llm.ainvoke(self.build_messages(prompt, context))
            return str(getattr(response, "content", response))
        except Exception as exc:
            raise OllamaConnectionError(
                f"Failed to connect to Ollama at {settings.ollama_base_url}. "
                f"Ensure Ollama is running and model '{settings.ollama_model}' is pulled."
            ) from exc

    @staticmethod
    def _sse(event: str, payload: dict) -> str:
        return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"


ollama_service = OllamaService()

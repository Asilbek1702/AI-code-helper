from collections.abc import AsyncGenerator
from typing import Any

from app.ai.chunker import CodeChunker
from app.ai.embeddings import embeddings_service
from app.ai.ollama_service import ollama_service


class RAGService:
    """Retrieval-augmented generation over indexed code chunks."""

    async def query(self, query: str, top_k: int = 3) -> AsyncGenerator[str, None]:
        context = self.build_context(self.retrieve(query, top_k=top_k))
        prompt = f"""Answer the user's coding question using the retrieved code context when relevant.
If the context is insufficient, say what is missing and continue with best-effort guidance.

Question:
{query}"""

        async for chunk in ollama_service.stream_response(prompt, context):
            yield chunk

    async def query_sse(self, query: str, top_k: int = 3) -> AsyncGenerator[str, None]:
        context = self.build_context(self.retrieve(query, top_k=top_k))
        prompt = f"""Answer the user's coding question using the retrieved code context when relevant.
If the context is insufficient, say what is missing and continue with best-effort guidance.

Question:
{query}"""

        async for event in ollama_service.stream_sse(prompt, context):
            yield event

    async def query_text(self, query: str, top_k: int = 3) -> str:
        context = self.build_context(self.retrieve(query, top_k=top_k))
        prompt = f"""Answer the user's coding question using the retrieved code context when relevant.
If the context is insufficient, say what is missing and continue with best-effort guidance.

Question:
{query}"""
        return await ollama_service.generate_response(prompt, context)

    def retrieve(self, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        return embeddings_service.search(query, top_k=min(max(top_k, 1), 10))

    @staticmethod
    def build_context(chunks: list[dict[str, Any]]) -> str:
        if not chunks:
            return ""

        context_parts = ["Retrieved code chunks:"]
        for index, chunk in enumerate(chunks[:3], start=1):
            metadata = chunk.get("metadata", {})
            filename = metadata.get("filename", "unknown file")
            language = metadata.get("language", "text")
            start_line = metadata.get("start_line", "?")
            end_line = metadata.get("end_line", "?")
            context_parts.append(
                f"\n[Chunk {index}: {filename}:{start_line}-{end_line} ({language})]\n"
                f"```{language}\n{chunk.get('content', '')}\n```"
            )

        return "\n".join(context_parts)

    async def add_code_context(
        self,
        code: str,
        language: str,
        metadata: dict[str, Any] | None = None,
    ) -> int:
        filename = metadata.get("filename") if metadata else None
        chunks = CodeChunker.chunk_code(code, language, strategy="boundaries", filename=filename)

        if metadata:
            for chunk in chunks:
                chunk["metadata"].update(metadata)

        return embeddings_service.add_chunks(chunks)

    async def clear_context(self) -> None:
        embeddings_service.clear_collection()


rag_service = RAGService()

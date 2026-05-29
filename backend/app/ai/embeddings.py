import os
from typing import Any

import chromadb
from pydantic_settings import BaseSettings
from sentence_transformers import SentenceTransformer


class Settings(BaseSettings):
    chroma_persist_dir: str = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma")
    embeddings_model: str = os.getenv("EMBEDDINGS_MODEL", "all-MiniLM-L6-v2")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


class EmbeddingsService:
    """Generate code embeddings and store/retrieve them in ChromaDB."""

    def __init__(self, persist_dir: str | None = None) -> None:
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        os.makedirs(self.persist_dir, exist_ok=True)

        self.embeddings_model = SentenceTransformer(settings.embeddings_model)
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        self.collection = self.client.get_or_create_collection(
            name="code_chunks",
            metadata={"hnsw:space": "cosine"},
        )

    def embed_text(self, text: str) -> list[float]:
        return self.embeddings_model.encode(text, convert_to_tensor=False).tolist()

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        return self.embeddings_model.encode(texts, convert_to_tensor=False).tolist()

    def add_chunks(self, chunks: list[dict[str, Any]]) -> int:
        """Upsert code chunks into ChromaDB."""
        valid_chunks = [chunk for chunk in chunks if chunk.get("content", "").strip()]
        if not valid_chunks:
            return 0

        documents = [chunk["content"] for chunk in valid_chunks]
        self.collection.upsert(
            ids=[chunk["id"] for chunk in valid_chunks],
            embeddings=self.embed_batch(documents),
            documents=documents,
            metadatas=[self._clean_metadata(chunk.get("metadata", {})) for chunk in valid_chunks],
        )
        return len(valid_chunks)

    def search(self, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        if not query.strip():
            return []

        results = self.collection.query(
            query_embeddings=[self.embed_text(query)],
            n_results=max(1, top_k),
            include=["documents", "metadatas", "distances"],
        )

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        return [
            {
                "content": document,
                "metadata": metadatas[index] if index < len(metadatas) else {},
                "distance": distances[index] if index < len(distances) else None,
            }
            for index, document in enumerate(documents)
        ]

    def clear_collection(self) -> None:
        self.client.delete_collection(name="code_chunks")
        self.collection = self.client.get_or_create_collection(
            name="code_chunks",
            metadata={"hnsw:space": "cosine"},
        )

    @staticmethod
    def _clean_metadata(metadata: dict[str, Any]) -> dict[str, str | int | float | bool]:
        clean: dict[str, str | int | float | bool] = {}
        for key, value in metadata.items():
            if isinstance(value, (str, int, float, bool)):
                clean[key] = value
            elif value is not None:
                clean[key] = str(value)
        return clean


embeddings_service = EmbeddingsService()

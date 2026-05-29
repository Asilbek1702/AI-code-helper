import hashlib
import re


class CodeChunker:
    """Split source files into function/class chunks with line-based fallback."""

    PATTERNS = {
        "python": [
            r"^(async\s+def|def|class)\s+\w+",
        ],
        "typescript": [
            r"^(export\s+)?(async\s+)?function\s+\w+",
            r"^(export\s+)?(abstract\s+)?class\s+\w+",
            r"^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s*)?(\([^)]*\)|\w+)\s*=>",
            r"^\s{2,}(public\s+|private\s+|protected\s+|static\s+|async\s+)*\w+\s*\(",
        ],
        "javascript": [
            r"^(export\s+)?(async\s+)?function\s+\w+",
            r"^(export\s+)?class\s+\w+",
            r"^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s*)?(\([^)]*\)|\w+)\s*=>",
            r"^\s{2,}(static\s+|async\s+)*\w+\s*\(",
        ],
        "java": [
            r"^\s*(public|private|protected)?\s*(static\s+)?(class|interface|enum)\s+\w+",
            r"^\s*(public|private|protected)?\s*(static\s+)?[\w<>\[\]]+\s+\w+\s*\(",
        ],
        "go": [
            r"^func\s+(\(\w+\s+\*?\w+\)\s+)?\w+\s*\(",
            r"^type\s+\w+\s+(struct|interface)",
        ],
    }

    @staticmethod
    def split_by_boundaries(content: str, language: str = "typescript") -> list[tuple[str, int]]:
        lines = content.splitlines()
        if not any(line.strip() for line in lines):
            return []

        patterns = CodeChunker.PATTERNS.get(language.lower(), CodeChunker.PATTERNS["typescript"])
        boundary_indexes = [
            index
            for index, line in enumerate(lines)
            if any(re.match(pattern, line) for pattern in patterns)
        ]

        if not boundary_indexes:
            return []

        if boundary_indexes[0] != 0:
            boundary_indexes.insert(0, 0)

        chunks: list[tuple[str, int]] = []
        for position, start in enumerate(boundary_indexes):
            end = boundary_indexes[position + 1] if position + 1 < len(boundary_indexes) else len(lines)
            chunk = "\n".join(lines[start:end]).strip()
            if chunk:
                chunks.append((chunk, start + 1))

        return chunks

    @staticmethod
    def split_by_lines(content: str, lines_per_chunk: int = 50, overlap: int = 10) -> list[tuple[str, int]]:
        lines = content.splitlines()
        if not any(line.strip() for line in lines):
            return []

        step = max(1, lines_per_chunk - overlap)
        chunks: list[tuple[str, int]] = []

        for start in range(0, len(lines), step):
            end = min(start + lines_per_chunk, len(lines))
            chunk = "\n".join(lines[start:end]).strip()
            if chunk:
                chunks.append((chunk, start + 1))
            if end == len(lines):
                break

        return chunks

    @staticmethod
    def chunk_code(
        content: str,
        language: str = "typescript",
        strategy: str = "boundaries",
        filename: str | None = None,
    ) -> list[dict]:
        if not content.strip():
            return []

        if strategy == "lines":
            chunks_data = CodeChunker.split_by_lines(content)
        else:
            chunks_data = CodeChunker.split_by_boundaries(content, language)
            if not chunks_data:
                chunks_data = CodeChunker.split_by_lines(content)

        chunks: list[dict] = []
        for index, (chunk_content, start_line) in enumerate(chunks_data):
            line_count = len(chunk_content.splitlines())
            chunk_hash = hashlib.sha1(
                f"{filename or ''}:{language}:{start_line}:{chunk_content}".encode("utf-8")
            ).hexdigest()[:16]
            metadata = {
                "language": language,
                "start_line": start_line,
                "end_line": start_line + line_count - 1,
                "chunk_index": index,
            }
            if filename:
                metadata["filename"] = filename

            chunks.append(
                {
                    "id": f"code_{chunk_hash}",
                    "content": chunk_content,
                    "metadata": metadata,
                }
            )

        return chunks

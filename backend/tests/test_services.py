"""Unit tests for AI services."""

import pytest
from app.ai.chunker import CodeChunker


class TestCodeChunker:
    """Test code chunking functionality."""

    def test_split_by_boundaries_typescript(self):
        """Test splitting TypeScript code by boundaries."""
        code = """
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

class Calculator {
  compute() {
    return 42;
  }
}
"""
        chunks = CodeChunker.split_by_boundaries(code, "typescript")
        assert len(chunks) > 0
        assert all(isinstance(chunk, tuple) for chunk in chunks)
        assert all(len(chunk) == 2 for chunk in chunks)  # (content, start_line)

    def test_split_by_boundaries_python(self):
        """Test splitting Python code by boundaries."""
        code = """
def greet(name):
    return f"Hello {name}"

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

class MathHelper:
    def add(self, a, b):
        return a + b
"""
        chunks = CodeChunker.split_by_boundaries(code, "python")
        assert len(chunks) > 0

    def test_split_by_lines(self):
        """Test splitting code by fixed lines."""
        code = "\n".join([f"line {i}" for i in range(100)])
        chunks = CodeChunker.split_by_lines(code, lines_per_chunk=25, overlap=5)
        assert len(chunks) > 0
        assert all(len(chunk[0].split("\n")) <= 25 for chunk in chunks)

    def test_chunk_code_with_metadata(self):
        """Test chunking code returns proper metadata."""
        code = """
function test() {
  console.log('test');
}
"""
        chunks = CodeChunker.chunk_code(code, "typescript", strategy="boundaries")
        assert len(chunks) > 0
        for chunk in chunks:
            assert "id" in chunk
            assert "content" in chunk
            assert "metadata" in chunk
            assert chunk["metadata"]["language"] == "typescript"
            assert "start_line" in chunk["metadata"]
            assert "chunk_index" in chunk["metadata"]

    def test_chunk_code_empty_string(self):
        """Test chunking empty string."""
        chunks = CodeChunker.chunk_code("", "typescript")
        assert chunks == [] or all(chunk["content"].strip() == "" for chunk in chunks)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

import shutil
import tempfile
import zipfile
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import AsyncSessionLocal
from app.models.project import Project
from app.models.user import User

settings = get_settings()

IGNORED_DIRS = {".git", "node_modules", "__pycache__", ".next", "dist", "build", ".venv", "venv"}
INDEX_EXTENSIONS = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".scss",
    ".md",
    ".html",
    ".java",
    ".go",
}


async def handle_zip_upload(db: AsyncSession, user: User, upload: UploadFile) -> tuple[Project, str]:
    if not upload.filename or not upload.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .zip uploads are supported")

    temp_dir = tempfile.mkdtemp(prefix="ai-code-upload-")
    zip_path = Path(temp_dir) / "upload.zip"
    extract_dir = Path(temp_dir) / "extracted"
    extract_dir.mkdir(parents=True, exist_ok=True)

    size = await _save_upload(upload, zip_path)
    if size > settings.upload_max_bytes:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Upload exceeds 50MB")

    try:
        _extract_zip_safely(zip_path, extract_dir)
        file_tree, file_count, total_size = scan_project_files(extract_dir)
    except zipfile.BadZipFile as exc:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ZIP file") from exc
    except Exception:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise

    project = Project(
        user_id=user.id,
        name=Path(upload.filename).stem,
        original_filename=upload.filename,
        file_count=file_count,
        total_size=total_size,
        status="uploaded",
        file_tree=file_tree,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    return project, str(extract_dir)


async def index_project_background(project_id: str, extracted_path: str) -> None:
    from app.ai.rag import rag_service

    try:
        for path in _iter_indexable_files(Path(extracted_path)):
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue

            language = _language_for_path(path)
            metadata = {"filename": str(path.relative_to(extracted_path)), "project_id": project_id}
            await rag_service.add_code_context(content, language, metadata)

        async with AsyncSessionLocal() as db:
            project = await db.get(Project, project_id)
            if project:
                project.status = "indexed"
                await db.commit()
    except Exception:
        async with AsyncSessionLocal() as db:
            project = await db.get(Project, project_id)
            if project:
                project.status = "index_failed"
                await db.commit()
    finally:
        shutil.rmtree(Path(extracted_path).parent, ignore_errors=True)


def scan_project_files(root: Path) -> tuple[dict[str, Any], int, int]:
    files: list[dict[str, Any]] = []
    file_count = 0
    total_size = 0

    for path in sorted(root.rglob("*")):
        if _is_ignored(path, root) or not path.is_file():
            continue
        stat = path.stat()
        file_count += 1
        total_size += stat.st_size
        files.append(
            {
                "path": str(path.relative_to(root)).replace("\\", "/"),
                "name": path.name,
                "extension": path.suffix.lower(),
                "size": stat.st_size,
            }
        )

    return {"root": root.name, "files": files}, file_count, total_size


async def _save_upload(upload: UploadFile, destination: Path) -> int:
    size = 0
    with destination.open("wb") as output:
        while chunk := await upload.read(1024 * 1024):
            size += len(chunk)
            if size > settings.upload_max_bytes:
                break
            output.write(chunk)
    return size


def _extract_zip_safely(zip_path: Path, destination: Path) -> None:
    with zipfile.ZipFile(zip_path) as archive:
        for member in archive.infolist():
            target = destination / member.filename
            resolved_target = target.resolve()
            try:
                resolved_target.relative_to(destination.resolve())
            except ValueError as exc:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsafe ZIP path detected")
        archive.extractall(destination)


def _iter_indexable_files(root: Path):
    for path in root.rglob("*"):
        if _is_ignored(path, root) or not path.is_file() or path.suffix.lower() not in INDEX_EXTENSIONS:
            continue
        if path.stat().st_size <= 512 * 1024:
            yield path


def _is_ignored(path: Path, root: Path) -> bool:
    try:
        relative_parts = path.relative_to(root).parts
    except ValueError:
        return True
    return any(part in IGNORED_DIRS for part in relative_parts)


def _language_for_path(path: Path) -> str:
    return {
        ".py": "python",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".js": "javascript",
        ".jsx": "javascript",
        ".java": "java",
        ".go": "go",
    }.get(path.suffix.lower(), path.suffix.lower().lstrip(".") or "text")

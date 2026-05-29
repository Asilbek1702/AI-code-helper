from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.project import ProjectResponse
from app.services.project_service import handle_zip_upload, index_project_background

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/upload", response_model=ProjectResponse)
async def upload_project(
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    file: UploadFile = File(...),
):
    project, extracted_dir = await handle_zip_upload(db, current_user, file)
    background_tasks.add_task(index_project_background, project.id, extracted_dir)
    return project

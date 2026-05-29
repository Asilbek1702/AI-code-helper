from datetime import datetime

from pydantic import BaseModel


class ProjectResponse(BaseModel):
    id: str
    name: str
    original_filename: str
    file_count: int
    total_size: int
    status: str
    file_tree: dict
    created_at: datetime

    class Config:
        from_attributes = True

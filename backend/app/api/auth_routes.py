from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import AuthRequest, RefreshRequest, TokenResponse
from app.services.auth_service import authenticate_user, create_user, issue_tokens, refresh_tokens

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
async def register(payload: AuthRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await create_user(db, payload.email, payload.password)
    return issue_tokens(user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: AuthRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await authenticate_user(db, payload.email, payload.password)
    return issue_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    return await refresh_tokens(db, payload.refresh_token)

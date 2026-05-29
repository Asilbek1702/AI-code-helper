from fastapi import HTTPException, status
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User

settings = get_settings()


async def create_user(db: AsyncSession, email: str, password: str) -> User:
    existing = await db.scalar(select(User).where(User.email == email.lower()))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=email.lower(), hashed_password=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    user = await db.scalar(select(User).where(User.email == email.lower()))
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is disabled")
    return user


def issue_tokens(user: User) -> dict:
    return {
        "access_token": create_access_token(user.id, {"email": user.email}),
        "refresh_token": create_refresh_token(user.id, {"email": user.email}),
        "token_type": "bearer",
        "expires_in": settings.access_token_expire_minutes * 60,
    }


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> dict:
    try:
        payload = decode_token(refresh_token, expected_type="refresh")
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    user_id = payload.get("sub")
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return issue_tokens(user)

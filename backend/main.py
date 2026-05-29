from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import ai_routes, auth_routes, chat_routes, project_routes

app = FastAPI(
    title="AI Coding Assistant API",
    description="Backend API for AI-powered code analysis",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_routes.router, prefix="/ai", tags=["AI"])
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI"])
app.include_router(auth_routes.router)
app.include_router(chat_routes.router)
app.include_router(project_routes.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "ai-coding-assistant"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

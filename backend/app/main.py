from fastapi import FastAPI

# Database
from app.database.database import engine
from app.database.base import Base

# Models
from app.models.user import User

# Routers
from app.api.users import router as user_router

# Create all database tables
Base.metadata.create_all(bind=engine)

# FastAPI Application
app = FastAPI(
    title="SentinelX",
    description="AI Powered Cybersecurity Platform",
    version="1.0.0"
)

# Include API Routers
app.include_router(user_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to SentinelX",
        "status": "Database Connected Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "database": "Connected",
        "version": "1.0.0"
    }
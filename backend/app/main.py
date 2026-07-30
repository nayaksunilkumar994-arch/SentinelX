from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.database.database import Base, engine

# Routers
from app.api.users import router as user_router
from app.api.threat import router as threat_router

# ======================================================
# Create Database Tables
# ======================================================
Base.metadata.create_all(bind=engine)

# ======================================================
# FastAPI Application
# ======================================================
app = FastAPI(
    title="SentinelX API",
    description="Cybersecurity Threat Intelligence Platform",
    version="1.0.0",
)

# ======================================================
# CORS Configuration
# ======================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# Home Route
# ======================================================
@app.get("/")
def root():
    return {
        "message": "Welcome to SentinelX API",
        "status": "Running",
        "version": "1.0.0"
    }

# ======================================================
# Health Check
# ======================================================
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

# ======================================================
# Register Routers
# ======================================================
app.include_router(
    user_router,
    prefix="/api/users",
    tags=["Users"]
)

app.include_router(
    threat_router,
    prefix="/api/threat",
    tags=["Threat Intelligence"]
)
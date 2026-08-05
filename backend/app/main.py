from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import Routers
from app.api.users import router as users_router
from app.api.threat import router as threat_router
from app.api.ai import router as ai_router
from app.api.chat import router as chat_router
from app.api.report import router as report_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="SentinelX API",
    description="AI-Powered Cyber Threat Intelligence Platform",
    version="1.0.0"
)

# ==============================
# CORS Configuration
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Register API Routers
# ==============================

app.include_router(users_router)
app.include_router(threat_router)
app.include_router(ai_router)
app.include_router(chat_router)
app.include_router(report_router)
app.include_router(dashboard_router)

# ==============================
# Root Endpoint
# ==============================

@app.get("/")
def root():
    return {
        "message": "Welcome to SentinelX API",
        "status": "Running",
        "version": "1.0.0",
        "modules": [
            "Threat Intelligence",
            "AI Threat Analysis",
            "AI Chat",
            "PDF Report Generator",
            "Dashboard"
        ]
    }

# ==============================
# Health Check
# ==============================

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "application": "SentinelX",
        "version": "1.0.0"
    }
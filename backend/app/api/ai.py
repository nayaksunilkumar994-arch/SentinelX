from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import analyze_threat

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


class ThreatRequest(BaseModel):
    ip: str
    country: str
    city: str
    organization: str
    timezone: str


@router.post("/analyze")
def analyze(request: ThreatRequest):
    result = analyze_threat(request.dict())

    return {
        "status": "success",
        "analysis": result
    }

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.ai_service import analyze_threat


router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"],
)


class ThreatRequest(BaseModel):
    ip: str
    country: str = "Unknown"
    city: str = "Unknown"
    organization: str = "Unknown"
    timezone: str = "Unknown"

    risk_score: int | None = None
    risk_level: str | None = None
    confidence: str | None = None
    sources_checked: list[str] = Field(default_factory=list)
    malicious_detections: int = 0
    suspicious_detections: int = 0
    abuse_confidence_score: int = 0
    total_reports: int = 0
    country_code: str | None = None
    isp: str | None = None
    recommended_action: str | None = None
    reason: str | None = None


@router.post("/analyze")
def analyze(
    request: ThreatRequest,
    current_user: User = Depends(get_current_user),
):
    result = analyze_threat(request.model_dump())

    return {
        "status": "success",
        "analysis": result,
    }

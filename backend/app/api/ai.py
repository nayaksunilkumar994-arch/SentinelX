from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.dependencies import get_current_user
from app.models.user import User
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
def analyze(
    request: ThreatRequest,
    current_user: User = Depends(get_current_user),
):
    result = analyze_threat(request.dict())

    return {
        "status": "success",
        "analysis": result
    }
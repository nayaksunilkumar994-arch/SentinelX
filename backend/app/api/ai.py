from fastapi import APIRouter

from app.schemas.ai import (
    AIAnalysisRequest,
    AIAnalysisResponse,
)

from app.services.ai_service import analyze_threat

router = APIRouter(
    prefix="/ai",
    tags=["AI Threat Analysis"],
)


@router.post(
    "/analyze",
    response_model=AIAnalysisResponse,
)
def analyze(request: AIAnalysisRequest):
    result = analyze_threat(request.threat_data)

    return AIAnalysisResponse(
        analysis=result
    )
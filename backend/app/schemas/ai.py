from pydantic import BaseModel


class AIAnalysisRequest(BaseModel):
    threat_data: str


class AIAnalysisResponse(BaseModel):
    analysis: str
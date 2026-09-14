from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InvestigationCreate(BaseModel):

    ip: str

    country: Optional[str] = None

    region: Optional[str] = None

    city: Optional[str] = None

    organization: Optional[str] = None

    timezone: Optional[str] = None

    risk_level: Optional[str] = None

    ai_analysis: Optional[str] = None


class InvestigationResponse(BaseModel):

    id: int

    ip: str

    country: Optional[str] = None

    region: Optional[str] = None

    city: Optional[str] = None

    organization: Optional[str] = None

    timezone: Optional[str] = None

    risk_level: Optional[str] = None

    ai_analysis: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True
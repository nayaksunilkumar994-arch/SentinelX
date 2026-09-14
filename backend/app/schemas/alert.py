from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel


# ==========================================
# Alert Value Types
# ==========================================

AlertSeverity = Literal[
    "Critical",
    "High",
    "Medium",
    "Low",
]

AlertStatus = Literal[
    "Open",
    "Acknowledged",
    "Resolved",
]


# ==========================================
# Create Alert
# ==========================================

class AlertCreate(BaseModel):

    investigation_id: int

    title: str

    description: Optional[str] = None

    severity: AlertSeverity = "Medium"

    status: AlertStatus = "Open"

    source: Optional[str] = None


# ==========================================
# Update Alert
# ==========================================

class AlertUpdate(BaseModel):

    severity: Optional[AlertSeverity] = None

    status: Optional[AlertStatus] = None

    title: Optional[str] = None

    description: Optional[str] = None


# ==========================================
# Alert Response
# ==========================================

class AlertResponse(BaseModel):

    id: int

    investigation_id: int

    title: str

    description: Optional[str] = None

    severity: AlertSeverity

    status: AlertStatus

    source: Optional[str] = None

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True
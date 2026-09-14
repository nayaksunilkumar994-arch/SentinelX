from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from sqlalchemy import func

from app.database.database import SessionLocal
from app.models.alert import Alert
from app.models.investigation import Investigation


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ==========================================
# Database Dependency
# ==========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ==========================================
# Dashboard Statistics
# ==========================================

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    total_investigations = (
        db.query(
            func.count(Investigation.id)
        ).scalar()
        or 0
    )

    total_alerts = (
        db.query(
            func.count(Alert.id)
        ).scalar()
        or 0
    )

    open_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.status == "Open"
        )
        .scalar()
        or 0
    )

    acknowledged_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.status == "Acknowledged"
        )
        .scalar()
        or 0
    )

    resolved_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.status == "Resolved"
        )
        .scalar()
        or 0
    )

    critical_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.severity == "Critical"
        )
        .scalar()
        or 0
    )

    high_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.severity == "High"
        )
        .scalar()
        or 0
    )

    medium_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.severity == "Medium"
        )
        .scalar()
        or 0
    )

    low_alerts = (
        db.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.severity == "Low"
        )
        .scalar()
        or 0
    )

    return {

        "investigations": {
            "total": total_investigations
        },

        "alerts": {
            "total": total_alerts,

            "status": {
                "open": open_alerts,
                "acknowledged": acknowledged_alerts,
                "resolved": resolved_alerts
            },

            "severity": {
                "critical": critical_alerts,
                "high": high_alerts,
                "medium": medium_alerts,
                "low": low_alerts
            }
        }
    }
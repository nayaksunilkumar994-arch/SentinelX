from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.schemas.alert import (
    AlertCreate,
    AlertUpdate,
    AlertResponse,
)

from app.services.alert_service import (
    create_alert,
    get_all_alerts,
    get_alert,
    get_investigation_alerts,
    update_alert,
    delete_alert,
)


router = APIRouter(
    prefix="/alerts",
    tags=["SOC Alerts"],
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
# Create Alert
# ==========================================

@router.post(
    "/",
    response_model=AlertResponse,
)
def create_alert_endpoint(
    alert: AlertCreate,
    db: Session = Depends(get_db),
):

    return create_alert(
        db,
        alert,
    )


# ==========================================
# Get All Alerts
# ==========================================

@router.get(
    "/",
    response_model=list[AlertResponse],
)
def get_alerts_endpoint(
    db: Session = Depends(get_db),
):

    return get_all_alerts(db)


# ==========================================
# Get Alerts For Investigation
# ==========================================

@router.get(
    "/investigation/{investigation_id}",
    response_model=list[AlertResponse],
)
def get_investigation_alerts_endpoint(
    investigation_id: int,
    db: Session = Depends(get_db),
):

    return get_investigation_alerts(
        db,
        investigation_id,
    )


# ==========================================
# Get One Alert
# ==========================================

@router.get(
    "/{alert_id}",
    response_model=AlertResponse,
)
def get_alert_endpoint(
    alert_id: int,
    db: Session = Depends(get_db),
):

    alert = get_alert(
        db,
        alert_id,
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    return alert


# ==========================================
# Update Alert
# ==========================================

@router.patch(
    "/{alert_id}",
    response_model=AlertResponse,
)
def update_alert_endpoint(
    alert_id: int,
    alert_update: AlertUpdate,
    db: Session = Depends(get_db),
):

    alert = update_alert(
        db,
        alert_id,
        alert_update,
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    return alert


# ==========================================
# Delete Alert
# ==========================================

@router.delete(
    "/{alert_id}",
    response_model=AlertResponse,
)
def delete_alert_endpoint(
    alert_id: int,
    db: Session = Depends(get_db),
):

    alert = delete_alert(
        db,
        alert_id,
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    return alert
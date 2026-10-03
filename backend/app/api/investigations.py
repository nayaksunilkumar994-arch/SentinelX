from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.api.role_checker import RoleChecker
from app.models.user import User

from app.database.database import get_db

from app.schemas.investigation import (
    InvestigationCreate,
    InvestigationResponse,
)

from app.services.investigation_service import (
    create_investigation,
    get_all_investigations,
    get_investigation,
    delete_investigation,
)


router = APIRouter(
    prefix="/investigations",
    tags=["Investigation History"],
)


# ==========================================================
# ROLE-BASED ACCESS CONTROL
# ==========================================================

allow_admin = RoleChecker(["admin"])


# ==========================================================
# CREATE INVESTIGATION
# ==========================================================

@router.post(
    "/",
    response_model=InvestigationResponse,
    status_code=201,
)
def create(
    investigation: InvestigationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return create_investigation(
        db,
        investigation,
    )


# ==========================================================
# GET ALL INVESTIGATIONS
# ==========================================================

@router.get(
    "/",
    response_model=list[InvestigationResponse],
)
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_all_investigations(db)


# ==========================================================
# GET SINGLE INVESTIGATION
# ==========================================================

@router.get(
    "/{investigation_id}",
    response_model=InvestigationResponse,
)
def get_one(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    investigation = get_investigation(
        db,
        investigation_id,
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found",
        )

    return investigation


# ==========================================================
# DELETE INVESTIGATION — ADMIN ONLY
# ==========================================================

@router.delete(
    "/{investigation_id}",
)
def delete(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_admin),
):

    investigation = delete_investigation(
        db,
        investigation_id,
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found",
        )

    return {
        "message": "Investigation deleted successfully"
    }
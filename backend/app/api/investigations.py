from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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


@router.post(
    "/",
    response_model=InvestigationResponse,
    status_code=201,
)
def create(
    investigation: InvestigationCreate,
    db: Session = Depends(get_db),
):

    return create_investigation(
        db,
        investigation,
    )


@router.get(
    "/",
    response_model=list[InvestigationResponse],
)
def get_all(
    db: Session = Depends(get_db),
):

    return get_all_investigations(db)


@router.get(
    "/{investigation_id}",
    response_model=InvestigationResponse,
)
def get_one(
    investigation_id: int,
    db: Session = Depends(get_db),
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


@router.delete(
    "/{investigation_id}",
)
def delete(
    investigation_id: int,
    db: Session = Depends(get_db),
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
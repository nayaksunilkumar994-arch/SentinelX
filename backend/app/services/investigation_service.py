from sqlalchemy.orm import Session

from app.models.investigation import Investigation
from app.schemas.investigation import InvestigationCreate


def create_investigation(
    db: Session,
    investigation: InvestigationCreate
):

    db_investigation = Investigation(
        ip=investigation.ip,
        country=investigation.country,
        region=investigation.region,
        city=investigation.city,
        organization=investigation.organization,
        timezone=investigation.timezone,
        risk_level=investigation.risk_level,
        ai_analysis=investigation.ai_analysis,
    )

    db.add(db_investigation)

    db.commit()

    db.refresh(db_investigation)

    return db_investigation


def get_all_investigations(db: Session):

    return (
        db.query(Investigation)
        .order_by(
            Investigation.created_at.desc()
        )
        .all()
    )


def get_investigation(
    db: Session,
    investigation_id: int
):

    return (
        db.query(Investigation)
        .filter(
            Investigation.id == investigation_id
        )
        .first()
    )


def delete_investigation(
    db: Session,
    investigation_id: int
):

    investigation = get_investigation(
        db,
        investigation_id
    )

    if not investigation:
        return None

    db.delete(investigation)

    db.commit()

    return investigation
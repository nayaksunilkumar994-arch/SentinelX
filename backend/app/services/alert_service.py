from typing import Optional

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertUpdate


# ==========================================================
# CREATE ALERT
# ==========================================================

def create_alert(
    db: Session,
    alert: AlertCreate,
):
    db_alert = Alert(
        investigation_id=alert.investigation_id,
        title=alert.title,
        description=alert.description,
        severity=alert.severity,
        status=alert.status,
        source=alert.source,
    )

    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    return db_alert


# ==========================================================
# GET ALL ALERTS
# ==========================================================

def get_all_alerts(db: Session):

    return (
        db.query(Alert)
        .order_by(
            Alert.created_at.desc()
        )
        .all()
    )


# ==========================================================
# GET ONE ALERT
# ==========================================================

def get_alert(
    db: Session,
    alert_id: int,
):

    return (
        db.query(Alert)
        .filter(
            Alert.id == alert_id
        )
        .first()
    )


# ==========================================================
# GET ALERTS FOR INVESTIGATION
# ==========================================================

def get_investigation_alerts(
    db: Session,
    investigation_id: int,
):

    return (
        db.query(Alert)
        .filter(
            Alert.investigation_id == investigation_id
        )
        .order_by(
            Alert.created_at.desc()
        )
        .all()
    )


# ==========================================================
# UPDATE ALERT
# ==========================================================

def update_alert(
    db: Session,
    alert_id: int,
    alert_update: AlertUpdate,
):

    alert = get_alert(
        db,
        alert_id,
    )

    if not alert:
        return None

    update_data = alert_update.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        setattr(
            alert,
            field,
            value,
        )

    db.commit()
    db.refresh(alert)

    return alert


# ==========================================================
# DELETE ALERT
# ==========================================================

def delete_alert(
    db: Session,
    alert_id: int,
):

    alert = get_alert(
        db,
        alert_id,
    )

    if not alert:
        return None

    db.delete(alert)
    db.commit()

    return alert


# ==========================================================
# DETERMINE ALERT SEVERITY
# ==========================================================

def determine_alert_severity(
    risk_score: int,
) -> Optional[str]:

    if risk_score >= 80:
        return "Critical"

    if risk_score >= 60:
        return "High"

    if risk_score >= 30:
        return "Medium"

    if risk_score > 0:
        return "Low"

    return None


# ==========================================================
# GENERATE SOC ALERT
# ==========================================================

def generate_soc_alert(
    db: Session,
    investigation_id: int,
    ip: str,
    risk_score: int,
    risk_level: str,
    reason: str,
):
    """
    Convert a threat correlation result into a SOC alert.

    Safe threats with a risk score of 0 do not generate alerts.
    """

    severity = determine_alert_severity(
        risk_score
    )

    # ------------------------------------------------------
    # SAFE / NO ALERT
    # ------------------------------------------------------

    if severity is None:
        return None

    # ------------------------------------------------------
    # ALERT TITLE
    # ------------------------------------------------------

    title = (
        f"{severity} Threat Detected: {ip}"
    )

    # ------------------------------------------------------
    # ALERT DESCRIPTION
    # ------------------------------------------------------

    description = (
        f"SentinelX detected a {risk_level} "
        f"threat involving IP address {ip}. "
        f"Risk score: {risk_score}/100. "
        f"Reason: {reason}"
    )

    # ------------------------------------------------------
    # CREATE ALERT
    # ------------------------------------------------------

    alert = Alert(
        investigation_id=investigation_id,
        title=title,
        description=description,
        severity=severity,
        status="Open",
        source="SentinelX Threat Correlation Engine",
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert
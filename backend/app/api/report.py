from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.api.dependencies import get_current_user
from app.models.user import User

from app.reports.report_generator import generate_report


router = APIRouter(
    prefix="/report",
    tags=["PDF Reports"],
)


@router.post("/generate")
def create_report(
    data: dict,
    current_user: User = Depends(get_current_user),
):

    # ------------------------------------------------------
    # Validate required fields
    # ------------------------------------------------------

    ip = data.get("ip")
    analysis = data.get("ai_analysis")

    if not ip:
        raise HTTPException(
            status_code=400,
            detail="IP address is required."
        )

    if not analysis:
        raise HTTPException(
            status_code=400,
            detail="AI analysis is required to generate the report."
        )

    # ------------------------------------------------------
    # Generate PDF
    # ------------------------------------------------------

    try:

        pdf = generate_report(
            ip,
            analysis
        )

    except Exception as error:

        print(
            "PDF Report Generation Error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate PDF report."
        )

    # ------------------------------------------------------
    # Return PDF
    # ------------------------------------------------------

    return FileResponse(
        pdf,
        media_type="application/pdf",
        filename="SentinelX_Report.pdf",
    )
from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.reports.report_generator import generate_report

router = APIRouter(
    prefix="/report",
    tags=["PDF Reports"],
)


@router.post("/generate")
def create_report(data: dict):

    ip = data["ip"]
    analysis = data["analysis"]

    pdf = generate_report(ip, analysis)

    return FileResponse(
        pdf,
        media_type="application/pdf",
        filename="SentinelX_Report.pdf",
    )
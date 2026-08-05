from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
async def get_dashboard_stats():
    return {
        "threats_detected": 127,
        "ips_analyzed": 865,
        "ai_analyses": 248,
        "reports_generated": 59
    }
from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.models.user import User

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ask_ai


router = APIRouter(
    prefix="/chat",
    tags=["AI Security Chat"]
)


@router.post(
    "/ask",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):

    answer = ask_ai(request.question)

    return ChatResponse(
        answer=answer
    )
from pydantic import BaseModel


# ==========================================================
# CHAT REQUEST
# ==========================================================

class ChatRequest(BaseModel):
    question: str


# ==========================================================
# CHAT RESPONSE
# ==========================================================

class ChatResponse(BaseModel):
    answer: str
from pydantic import BaseModel, EmailStr
from typing import Optional


# -----------------------------
# User Registration
# -----------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


# -----------------------------
# User Response
# -----------------------------
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


# -----------------------------
# User Login
# -----------------------------
class UserLogin(BaseModel):
    username: str
    password: str


# -----------------------------
# JWT Token Response
# -----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str


# -----------------------------
# Token Payload
# -----------------------------
class TokenData(BaseModel):
    username: Optional[str] = None
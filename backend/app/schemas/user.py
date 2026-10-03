from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# -----------------------------
# User Registration
# -----------------------------
class UserCreate(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )

    full_name: Optional[str] = Field(
        default=None,
        max_length=100
    )


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
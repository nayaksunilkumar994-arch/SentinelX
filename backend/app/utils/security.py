from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# ======================================================
# Password Hashing
# ======================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ======================================================
# OAuth2 Scheme
# ======================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login"
)

# ======================================================
# Hash Password
# ======================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ======================================================
# Verify Password
# ======================================================

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password,
    )

# ======================================================
# Create JWT
# ======================================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return encoded_jwt

# ======================================================
# Verify JWT
# ======================================================

def verify_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username: Optional[str] = payload.get("sub")

        if username is None:
            return None

        return username

    except JWTError:
        return None
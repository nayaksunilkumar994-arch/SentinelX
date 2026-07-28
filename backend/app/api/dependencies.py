from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.core.config import SECRET_KEY, ALGORITHM
from app.utils.security import oauth2_scheme


# ==========================================
# Get Current Logged-in User
# ==========================================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username: str = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


# ==========================================
# Get Current Admin
# ==========================================
def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user
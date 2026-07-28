from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
)
from app.services.user_service import (
    create_user,
    login_user,
    get_all_users,
    update_user_role,
    delete_user,
)
from app.api.dependencies import get_current_user
from app.api.role_checker import RoleChecker
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# -----------------------------
# Role Checker
# -----------------------------
allow_admin = RoleChecker(["admin"])


# -----------------------------
# Register User
# -----------------------------
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return create_user(db, user)


# -----------------------------
# Login User
# -----------------------------
@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = login_user(
        db=db,
        username=form_data.username,
        password=form_data.password,
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return token


# -----------------------------
# Current Logged-in User
# -----------------------------
@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


# -----------------------------
# Get All Users (Admin Only)
# -----------------------------
@router.get(
    "/all",
    response_model=list[UserResponse],
)
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_admin),
):
    return get_all_users(db)


# -----------------------------
# Update User Role (Admin Only)
# -----------------------------
@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def change_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_admin),
):
    user = update_user_role(
        db,
        user_id,
        role,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# -----------------------------
# Delete User (Admin Only)
# -----------------------------
@router.delete(
    "/{user_id}",
)
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_admin),
):
    user = delete_user(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "message": "User deleted successfully"
    }
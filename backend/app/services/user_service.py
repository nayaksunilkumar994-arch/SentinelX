from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)


# -----------------------------------
# Create User
# -----------------------------------
def create_user(db: Session, user: UserCreate):

    hashed_password = hash_password(user.password)

    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name,
        role="analyst"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# -----------------------------------
# Get User by Username
# -----------------------------------
def get_user_by_username(
    db: Session,
    username: str
):

    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )


# -----------------------------------
# Authenticate User
# -----------------------------------
def authenticate_user(
    db: Session,
    username: str,
    password: str
):

    user = get_user_by_username(
        db,
        username
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password
    ):
        return None

    return user


# -----------------------------------
# Login User
# -----------------------------------
def login_user(
    db: Session,
    username: str,
    password: str
):

    user = authenticate_user(
        db,
        username,
        password
    )

    if not user:
        return None

    access_token = create_access_token(
        data={
            "sub": user.username
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -----------------------------------
# Get All Users
# -----------------------------------
def get_all_users(db: Session):
    return db.query(User).all()


# -----------------------------------
# Get User by ID
# -----------------------------------
def get_user_by_id(
    db: Session,
    user_id: int
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


# -----------------------------------
# Update User Role
# -----------------------------------
def update_user_role(
    db: Session,
    user_id: int,
    new_role: str
):

    user = get_user_by_id(
        db,
        user_id
    )

    if not user:
        return None

    user.role = new_role

    db.commit()
    db.refresh(user)

    return user


# -----------------------------------
# Delete User
# -----------------------------------
def delete_user(
    db: Session,
    user_id: int
):

    user = get_user_by_id(
        db,
        user_id
    )

    if not user:
        return None

    db.delete(user)
    db.commit()

    return user
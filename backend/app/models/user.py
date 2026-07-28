from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    full_name = Column(String(150), nullable=True)

    role = Column(String(50), default="analyst")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
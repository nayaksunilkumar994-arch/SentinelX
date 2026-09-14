from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Investigation(Base):

    __tablename__ = "investigations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    ip = Column(
        String(45),
        nullable=False,
        index=True
    )

    country = Column(
        String(100),
        nullable=True
    )

    region = Column(
        String(100),
        nullable=True
    )

    city = Column(
        String(100),
        nullable=True
    )

    organization = Column(
        String(255),
        nullable=True
    )

    timezone = Column(
        String(100),
        nullable=True
    )

    risk_level = Column(
        String(50),
        nullable=True
    )

    ai_analysis = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
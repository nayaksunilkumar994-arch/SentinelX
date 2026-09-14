from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base


# ==========================================
# PostgreSQL Database Configuration
# ==========================================

DATABASE_URL = (
    "postgresql://postgres:sentinel123@127.0.0.1:5432/sentinelx_db"
)


# ==========================================
# Database Engine
# ==========================================

engine = create_engine(
    DATABASE_URL
)


# ==========================================
# Database Session
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ==========================================
# Database Dependency
# ==========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
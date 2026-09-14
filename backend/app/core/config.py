import os
from pathlib import Path

from dotenv import load_dotenv


# ==========================================================
# ENVIRONMENT CONFIGURATION
# ==========================================================

# Project root:
# SentinelX/
#
# config.py location:
# SentinelX/backend/app/core/config.py
#
# parents[0] = core
# parents[1] = app
# parents[2] = backend
# parents[3] = SentinelX

BASE_DIR = Path(__file__).resolve().parents[3]

ENV_FILE = BASE_DIR / ".env"

load_dotenv(
    dotenv_path=ENV_FILE
)


# ==========================================================
# JWT CONFIGURATION
# ==========================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ==========================================================
# VIRUSTOTAL CONFIGURATION
# ==========================================================

VIRUSTOTAL_API_KEY = os.getenv(
    "VIRUSTOTAL_API_KEY"
)

VIRUSTOTAL_BASE_URL = (
    "https://www.virustotal.com/api/v3"
)


# ==========================================================
# ABUSEIPDB CONFIGURATION
# ==========================================================

ABUSEIPDB_API_KEY = os.getenv(
    "ABUSEIPDB_API_KEY"
)

ABUSEIPDB_BASE_URL = (
    "https://api.abuseipdb.com/api/v2"
)


# ==========================================================
# GEMINI AI CONFIGURATION
# ==========================================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)
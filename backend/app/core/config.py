# ===============================
# SentinelX Configuration
# ===============================

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ===============================
# JWT Configuration
# ===============================

SECRET_KEY = "sentinelx_super_secret_key_2026"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ===============================
# VirusTotal Configuration
# ===============================

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

VIRUSTOTAL_BASE_URL = "https://www.virustotal.com/api/v3"
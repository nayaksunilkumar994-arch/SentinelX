import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==========================================
# JWT Configuration
# ==========================================

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ==========================================
# VirusTotal Configuration
# ==========================================

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
VIRUSTOTAL_BASE_URL = "https://www.virustotal.com/api/v3"

# ==========================================
# Gemini AI Configuration
# ==========================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
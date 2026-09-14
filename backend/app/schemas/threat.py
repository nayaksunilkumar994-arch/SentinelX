from typing import Optional

from pydantic import BaseModel


# ==========================================================
# IP LOOKUP RESPONSE
# ==========================================================

class IPLookupResponse(BaseModel):

    ip: str

    city: Optional[str] = None

    region: Optional[str] = None

    country: Optional[str] = None

    location: Optional[str] = None

    organization: Optional[str] = None

    timezone: Optional[str] = None


# ==========================================================
# DNS LOOKUP RESPONSE
# ==========================================================

class DNSLookupResponse(BaseModel):

    domain: str

    addresses: list[str]


# ==========================================================
# WHOIS RESPONSE
# ==========================================================

class WhoisResponse(BaseModel):

    domain: str

    registrar: Optional[str] = None

    creation_date: Optional[str] = None

    expiration_date: Optional[str] = None


# ==========================================================
# VIRUSTOTAL IP RESPONSE
# ==========================================================

class VirusTotalIPResponse(BaseModel):

    ip: str

    harmless: int = 0

    malicious: int = 0

    suspicious: int = 0

    undetected: int = 0

    reputation: str


# ==========================================================
# ABUSEIPDB IP RESPONSE
# ==========================================================

class AbuseIPDBResponse(BaseModel):

    ip: str

    abuse_confidence_score: int = 0

    country_code: Optional[str] = None

    isp: Optional[str] = None

    usage_type: Optional[str] = None

    total_reports: int = 0

    last_reported_at: Optional[str] = None

    reputation: str


# ==========================================================
# THREAT CORRELATION RESPONSE
# ==========================================================

class ThreatCorrelationResponse(BaseModel):

    ip: str

    risk_score: int

    risk_level: str

    confidence: str

    sources_checked: list[str]

    malicious_detections: int = 0

    suspicious_detections: int = 0

    abuse_confidence_score: int = 0

    total_reports: int = 0

    country_code: Optional[str] = None

    isp: Optional[str] = None

    # ------------------------------------------------------
    # Day 25 additions
    # ------------------------------------------------------

    recommended_action: str

    reason: str
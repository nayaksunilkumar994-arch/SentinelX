from pydantic import BaseModel
from typing import List, Optional


# ==========================================
# IP Lookup Response
# ==========================================

class IPLookupResponse(BaseModel):
    ip: str
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    location: Optional[str] = None
    organization: Optional[str] = None
    timezone: Optional[str] = None


# ==========================================
# DNS Lookup Response
# ==========================================

class DNSLookupResponse(BaseModel):
    domain: str
    addresses: List[str]


# ==========================================
# WHOIS Lookup Response
# ==========================================

class WhoisResponse(BaseModel):
    domain: str
    registrar: Optional[str] = None
    creation_date: Optional[str] = None
    expiration_date: Optional[str] = None


# ==========================================
# VirusTotal IP Lookup Response
# ==========================================

class VirusTotalIPResponse(BaseModel):
    ip: str
    harmless: int
    malicious: int
    suspicious: int
    undetected: int
    reputation: str
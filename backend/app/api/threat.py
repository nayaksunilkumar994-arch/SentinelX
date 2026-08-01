from fastapi import APIRouter

from app.schemas.threat import (
    IPLookupResponse,
    DNSLookupResponse,
    WhoisResponse,
    VirusTotalIPResponse,
)

from app.services.threat_service import (
    lookup_ip,
    lookup_dns,
    lookup_whois,
    lookup_virustotal_ip,
)

router = APIRouter(
    prefix="/threat",
    tags=["Threat Intelligence"],
)


# ==========================================
# IP Lookup
# ==========================================
@router.get(
    "/ip/{ip}",
    response_model=IPLookupResponse,
)
def get_ip_lookup(ip: str):
    return lookup_ip(ip)


# ==========================================
# DNS Lookup
# ==========================================
@router.get(
    "/dns/{domain}",
    response_model=DNSLookupResponse,
)
def get_dns_lookup(domain: str):
    return lookup_dns(domain)


# ==========================================
# WHOIS Lookup
# ==========================================
@router.get(
    "/whois/{domain}",
    response_model=WhoisResponse,
)
def get_whois_lookup(domain: str):
    return lookup_whois(domain)


# ==========================================
# VirusTotal IP Lookup
# ==========================================
@router.get(
    "/virustotal/ip/{ip}",
    response_model=VirusTotalIPResponse,
)
def get_virustotal_lookup(ip: str):
    return lookup_virustotal_ip(ip)
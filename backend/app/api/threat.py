from fastapi import APIRouter

from app.schemas.threat import (
    IPLookupResponse,
    DNSLookupResponse,
    WhoisResponse,
    VirusTotalIPResponse,
    AbuseIPDBResponse,
    ThreatCorrelationResponse,
)

from app.services.threat_service import (
    lookup_ip,
    lookup_dns,
    lookup_whois,
    lookup_virustotal_ip,
    lookup_abuseipdb,
    correlate_threat_intelligence,
)


router = APIRouter(
    prefix="/threat",
    tags=["Threat Intelligence"],
)


# ==========================================================
# IP LOOKUP
# ==========================================================

@router.get(
    "/ip/{ip}",
    response_model=IPLookupResponse,
)
def get_ip_lookup(ip: str):

    return lookup_ip(ip)


# ==========================================================
# DNS LOOKUP
# ==========================================================

@router.get(
    "/dns/{domain}",
    response_model=DNSLookupResponse,
)
def get_dns_lookup(domain: str):

    return lookup_dns(domain)


# ==========================================================
# WHOIS LOOKUP
# ==========================================================

@router.get(
    "/whois/{domain}",
    response_model=WhoisResponse,
)
def get_whois_lookup(domain: str):

    return lookup_whois(domain)


# ==========================================================
# VIRUSTOTAL IP LOOKUP
# ==========================================================

@router.get(
    "/virustotal/ip/{ip}",
    response_model=VirusTotalIPResponse,
)
def get_virustotal_lookup(ip: str):

    return lookup_virustotal_ip(ip)


# ==========================================================
# ABUSEIPDB IP LOOKUP
# ==========================================================

@router.get(
    "/abuseipdb/ip/{ip}",
    response_model=AbuseIPDBResponse,
)
def get_abuseipdb_lookup(ip: str):

    return lookup_abuseipdb(ip)


# ==========================================================
# THREAT INTELLIGENCE CORRELATION
# ==========================================================

@router.get(
    "/correlate/{ip}",
    response_model=ThreatCorrelationResponse,
)
def get_threat_correlation(ip: str):

    return correlate_threat_intelligence(ip)
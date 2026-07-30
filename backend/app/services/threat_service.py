import socket
import requests
import whois

from app.schemas.threat import (
    IPLookupResponse,
    DNSLookupResponse,
    WhoisResponse,
)


# ==========================================================
# IP LOOKUP
# ==========================================================
def lookup_ip(ip: str) -> IPLookupResponse:
    """
    Lookup IP information using ipinfo.io
    """

    try:
        response = requests.get(
            f"https://ipinfo.io/{ip}/json",
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        return IPLookupResponse(
            ip=data.get("ip", ip),
            city=data.get("city"),
            region=data.get("region"),
            country=data.get("country"),
            location=data.get("loc"),
            organization=data.get("org"),
            timezone=data.get("timezone"),
        )

    except Exception as e:
        raise Exception(f"IP Lookup Failed: {e}")


# ==========================================================
# DNS LOOKUP
# ==========================================================
def lookup_dns(domain: str) -> DNSLookupResponse:
    """
    Resolve DNS records.
    """

    try:
        addresses = socket.gethostbyname_ex(domain)[2]

        return DNSLookupResponse(
            domain=domain,
            addresses=addresses,
        )

    except Exception as e:
        raise Exception(f"DNS Lookup Failed: {e}")


# ==========================================================
# WHOIS LOOKUP
# ==========================================================
def lookup_whois(domain: str) -> WhoisResponse:
    """
    Perform WHOIS lookup.
    """

    try:
        data = whois.whois(domain)

        creation_date = data.creation_date
        expiration_date = data.expiration_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if isinstance(expiration_date, list):
            expiration_date = expiration_date[0]

        return WhoisResponse(
            domain=domain,
            registrar=data.registrar,
            creation_date=str(creation_date) if creation_date else None,
            expiration_date=str(expiration_date) if expiration_date else None,
        )

    except Exception as e:
        raise Exception(f"WHOIS Lookup Failed: {e}")
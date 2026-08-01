import socket
import requests
import whois

from app.core.config import (
    VIRUSTOTAL_API_KEY,
    VIRUSTOTAL_BASE_URL,
)

from app.schemas.threat import (
    IPLookupResponse,
    DNSLookupResponse,
    WhoisResponse,
    VirusTotalIPResponse,
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


# ==========================================================
# VIRUSTOTAL IP LOOKUP
# ==========================================================
def lookup_virustotal_ip(ip: str) -> VirusTotalIPResponse:

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }

    url = f"{VIRUSTOTAL_BASE_URL}/ip_addresses/{ip}"

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=20,
        )

        response.raise_for_status()

        data = response.json()

        stats = data["data"]["attributes"]["last_analysis_stats"]

        harmless = stats.get("harmless", 0)
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        undetected = stats.get("undetected", 0)

        if malicious > 0:
            reputation = "Malicious"
        elif suspicious > 0:
            reputation = "Suspicious"
        else:
            reputation = "Safe"

        return VirusTotalIPResponse(
            ip=ip,
            harmless=harmless,
            malicious=malicious,
            suspicious=suspicious,
            undetected=undetected,
            reputation=reputation,
        )

    except Exception as e:
        raise Exception(f"VirusTotal Lookup Failed: {e}")
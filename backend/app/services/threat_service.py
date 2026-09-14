import ipaddress
import socket

import requests
import whois

from app.core.config import (
    VIRUSTOTAL_API_KEY,
    VIRUSTOTAL_BASE_URL,
    ABUSEIPDB_API_KEY,
    ABUSEIPDB_BASE_URL,
)

from app.schemas.threat import (
    IPLookupResponse,
    DNSLookupResponse,
    WhoisResponse,
    VirusTotalIPResponse,
    AbuseIPDBResponse,
    ThreatCorrelationResponse,
)


# ==========================================================
# IP VALIDATION
# ==========================================================

def validate_ip_address(ip: str) -> str:
    """
    Validate an IPv4 or IPv6 address.

    Returns the normalized IP address when valid.
    Raises ValueError when invalid.
    """

    try:
        return str(
            ipaddress.ip_address(
                ip.strip()
            )
        )

    except ValueError:
        raise ValueError(
            f"Invalid IP address: {ip}"
        )


# ==========================================================
# IP LOOKUP
# ==========================================================

def lookup_ip(
    ip: str,
) -> IPLookupResponse:
    """
    Lookup IP information using ipinfo.io.
    """

    ip = validate_ip_address(ip)

    try:

        response = requests.get(
            f"https://ipinfo.io/{ip}/json",
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        return IPLookupResponse(
            ip=data.get(
                "ip",
                ip,
            ),
            city=data.get("city"),
            region=data.get("region"),
            country=data.get("country"),
            location=data.get("loc"),
            organization=data.get("org"),
            timezone=data.get("timezone"),
        )

    except requests.RequestException as e:

        raise Exception(
            f"IP Lookup Failed: {e}"
        )


# ==========================================================
# DNS LOOKUP
# ==========================================================

def lookup_dns(
    domain: str,
) -> DNSLookupResponse:
    """
    Resolve a domain name to its IP addresses.
    """

    try:

        domain = domain.strip()

        addresses = socket.gethostbyname_ex(
            domain
        )[2]

        return DNSLookupResponse(
            domain=domain,
            addresses=addresses,
        )

    except Exception as e:

        raise Exception(
            f"DNS Lookup Failed: {e}"
        )


# ==========================================================
# WHOIS LOOKUP
# ==========================================================

def lookup_whois(
    domain: str,
) -> WhoisResponse:
    """
    Retrieve WHOIS information for a domain.
    """

    try:

        domain = domain.strip()

        data = whois.whois(
            domain
        )

        creation_date = data.creation_date
        expiration_date = data.expiration_date

        if isinstance(
            creation_date,
            list,
        ):
            creation_date = creation_date[0]

        if isinstance(
            expiration_date,
            list,
        ):
            expiration_date = expiration_date[0]

        return WhoisResponse(
            domain=domain,
            registrar=data.registrar,
            creation_date=(
                str(creation_date)
                if creation_date
                else None
            ),
            expiration_date=(
                str(expiration_date)
                if expiration_date
                else None
            ),
        )

    except Exception as e:

        raise Exception(
            f"WHOIS Lookup Failed: {e}"
        )


# ==========================================================
# VIRUSTOTAL IP LOOKUP
# ==========================================================

def lookup_virustotal_ip(
    ip: str,
) -> VirusTotalIPResponse:
    """
    Lookup an IP address using VirusTotal.
    """

    ip = validate_ip_address(ip)

    if not VIRUSTOTAL_API_KEY:

        raise Exception(
            "VirusTotal API key is not configured."
        )

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY,
    }

    url = (
        f"{VIRUSTOTAL_BASE_URL}"
        f"/ip_addresses/{ip}"
    )

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=20,
        )

        response.raise_for_status()

        data = response.json()

        stats = (
            data["data"]
            ["attributes"]
            ["last_analysis_stats"]
        )

        harmless = stats.get(
            "harmless",
            0,
        )

        malicious = stats.get(
            "malicious",
            0,
        )

        suspicious = stats.get(
            "suspicious",
            0,
        )

        undetected = stats.get(
            "undetected",
            0,
        )

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

    except requests.RequestException as e:

        raise Exception(
            f"VirusTotal Lookup Failed: {e}"
        )

    except (
        KeyError,
        TypeError,
        ValueError,
    ) as e:

        raise Exception(
            f"Invalid VirusTotal response: {e}"
        )


# ==========================================================
# ABUSEIPDB IP LOOKUP
# ==========================================================

def lookup_abuseipdb(
    ip: str,
) -> AbuseIPDBResponse:
    """
    Lookup IP reputation using AbuseIPDB.
    """

    ip = validate_ip_address(ip)

    if not ABUSEIPDB_API_KEY:

        raise Exception(
            "AbuseIPDB API key is not configured."
        )

    headers = {
        "Key": ABUSEIPDB_API_KEY,
        "Accept": "application/json",
    }

    params = {
        "ipAddress": ip,
        "maxAgeInDays": 90,
    }

    url = (
        f"{ABUSEIPDB_BASE_URL}"
        "/check"
    )

    try:

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=20,
        )

        if response.status_code == 400:

            raise ValueError(
                "AbuseIPDB rejected the IP address."
            )

        if response.status_code == 401:

            raise ValueError(
                "Invalid AbuseIPDB API key."
            )

        if response.status_code == 403:

            raise ValueError(
                "AbuseIPDB access denied."
            )

        if response.status_code == 429:

            raise ValueError(
                "AbuseIPDB rate limit exceeded."
            )

        response.raise_for_status()

        data = response.json()

        result = data.get(
            "data",
            {},
        )

        abuse_confidence_score = result.get(
            "abuseConfidenceScore",
            0,
        )

        country_code = result.get(
            "countryCode"
        )

        isp = result.get(
            "isp"
        )

        usage_type = result.get(
            "usageType"
        )

        total_reports = result.get(
            "totalReports",
            0,
        )

        last_reported_at = result.get(
            "lastReportedAt"
        )

        if abuse_confidence_score >= 60:

            reputation = "Malicious"

        elif abuse_confidence_score >= 20:

            reputation = "Suspicious"

        else:

            reputation = "Safe"

        return AbuseIPDBResponse(
            ip=ip,
            abuse_confidence_score=(
                abuse_confidence_score
            ),
            country_code=country_code,
            isp=isp,
            usage_type=usage_type,
            total_reports=total_reports,
            last_reported_at=(
                str(last_reported_at)
                if last_reported_at
                else None
            ),
            reputation=reputation,
        )

    except ValueError:

        raise

    except requests.RequestException as e:

        raise Exception(
            f"AbuseIPDB Lookup Failed: {e}"
        )

    except (
        KeyError,
        TypeError,
    ) as e:

        raise Exception(
            f"Invalid AbuseIPDB response: {e}"
        )


# ==========================================================
# THREAT INTELLIGENCE CORRELATION
# ==========================================================

def correlate_threat_intelligence(
    ip: str,
) -> ThreatCorrelationResponse:
    """
    Correlate VirusTotal and AbuseIPDB intelligence
    into a single SentinelX risk assessment.

    Day 25 additionally generates:
        - recommended_action
        - reason
    """

    # ------------------------------------------------------
    # Validate IP
    # ------------------------------------------------------

    ip = validate_ip_address(ip)

    # ------------------------------------------------------
    # Query VirusTotal
    # ------------------------------------------------------

    virustotal = lookup_virustotal_ip(
        ip
    )

    # ------------------------------------------------------
    # Query AbuseIPDB
    # ------------------------------------------------------

    abuseipdb = lookup_abuseipdb(
        ip
    )

    # ------------------------------------------------------
    # Extract intelligence
    # ------------------------------------------------------

    malicious = virustotal.malicious

    suspicious = virustotal.suspicious

    abuse_score = (
        abuseipdb.abuse_confidence_score
    )

    total_reports = (
        abuseipdb.total_reports
    )

    # ------------------------------------------------------
    # Calculate risk score
    # ------------------------------------------------------

    risk_score = 0

    # VirusTotal malicious detections
    if malicious > 0:

        risk_score += 50

    # VirusTotal suspicious detections
    if suspicious > 0:

        risk_score += 20

    # AbuseIPDB confidence
    if abuse_score >= 80:

        risk_score += 30

    elif abuse_score >= 50:

        risk_score += 20

    elif abuse_score >= 20:

        risk_score += 10

    # ------------------------------------------------------
    # Limit risk score to 100
    # ------------------------------------------------------

    risk_score = min(
        risk_score,
        100,
    )

    # ------------------------------------------------------
    # Determine risk level
    # ------------------------------------------------------

    if risk_score >= 70:

        risk_level = "Malicious"

    elif risk_score >= 30:

        risk_level = "Suspicious"

    else:

        risk_level = "Safe"

    # ------------------------------------------------------
    # Determine confidence
    # ------------------------------------------------------

    if (
        malicious > 0
        and abuse_score >= 50
    ):

        confidence = "High"

    elif (
        malicious > 0
        or suspicious > 0
        or abuse_score >= 20
    ):

        confidence = "Medium"

    else:

        confidence = "High"

    # ======================================================
    # DAY 25 — SECURITY DECISION
    # ======================================================

    if risk_level == "Malicious":

        recommended_action = "Block"

        reason = (
            "Malicious indicators were detected "
            "by threat intelligence sources. "
            "Blocking the IP is recommended."
        )

    elif risk_level == "Suspicious":

        recommended_action = "Investigate"

        reason = (
            "Suspicious indicators were detected. "
            "Further investigation is recommended "
            "before allowing the IP."
        )

    else:

        recommended_action = "Allow"

        reason = (
            "No malicious or suspicious indicators "
            "were detected."
        )

    # ------------------------------------------------------
    # Return correlated result
    # ------------------------------------------------------

    return ThreatCorrelationResponse(

        ip=ip,

        risk_score=risk_score,

        risk_level=risk_level,

        confidence=confidence,

        sources_checked=[
            "IPInfo",
            "VirusTotal",
            "AbuseIPDB",
        ],

        malicious_detections=(
            malicious
        ),

        suspicious_detections=(
            suspicious
        ),

        abuse_confidence_score=(
            abuse_score
        ),

        total_reports=(
            total_reports
        ),

        country_code=(
            abuseipdb.country_code
        ),

        isp=(
            abuseipdb.isp
        ),

        # --------------------------------------------------
        # Day 25 fields
        # --------------------------------------------------

        recommended_action=(
            recommended_action
        ),

        reason=(
            reason
        ),
    )
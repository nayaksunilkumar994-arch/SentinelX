
def analyze_threat(ip_data: dict) -> str:
    """Generate a deterministic analysis using supplied threat data."""

    ip = ip_data.get("ip") or "Unknown"
    country = ip_data.get("country") or "Unknown"
    city = ip_data.get("city") or "Unknown"
    organization = (
        ip_data.get("isp")
        or ip_data.get("organization")
        or "Unknown"
    )
    timezone = ip_data.get("timezone") or "Unknown"

    risk_score = ip_data.get("risk_score")
    risk_level = ip_data.get("risk_level")
    confidence = ip_data.get("confidence")
    sources = ip_data.get("sources_checked") or []

    malicious = ip_data.get("malicious_detections", 0)
    suspicious = ip_data.get("suspicious_detections", 0)
    abuse_score = ip_data.get("abuse_confidence_score", 0)
    total_reports = ip_data.get("total_reports", 0)

    recommended_action = ip_data.get("recommended_action")
    reason = ip_data.get("reason")

    # Use the existing correlation result instead of inventing another risk.
    if risk_level and risk_score is not None:
        risk = str(risk_level).upper()
        risk_summary = (
            f"The threat-correlation service classified this IP as {risk} "
            f"with a correlation score of {risk_score}/100."
        )
    else:
        risk = "UNDETERMINED"
        risk_summary = (
            "No correlation classification was supplied. IP metadata alone "
            "cannot establish whether an address is malicious."
        )

    metadata = {
        "Country/Region": country,
        "City": city,
        "Organization/ISP": organization,
        "Timezone": timezone,
    }

    metadata_lines = "\n".join(
        f"• {label}: {value}"
        for label, value in metadata.items()
    )

    sources_text = (
        ", ".join(str(source) for source in sources)
        if sources
        else "No sources reported"
    )

    if risk_level and risk_score is not None:
        threat_evidence = (
            f"• VirusTotal malicious detections: {malicious}\n"
            f"• VirusTotal suspicious detections: {suspicious}\n"
            f"• AbuseIPDB confidence score: {abuse_score}\n"
            f"• AbuseIPDB total reports: {total_reports}\n"
            f"• Sources checked: {sources_text}"
        )
    else:
        threat_evidence = (
            "• No correlation result was supplied to this analysis.\n"
            "• Malware, phishing, and botnet activity cannot be confirmed "
            "or ruled out from metadata alone."
        )

    actions = recommended_action or (
        "Review available threat-intelligence evidence before deciding."
    )
    explanation = reason or (
        "Use the correlation score and supporting evidence to guide "
        "further investigation."
    )

    confidence_text = (
        str(confidence)
        if confidence
        else "Not supplied by the threat-correlation service"
    )

    return f"""
🔒 SentinelX AI Threat Analysis

IP Address:
{ip}

Risk Level:
{risk}

Correlation Risk Score:
{risk_score if risk_score is not None else "Not available"}

Summary:
{risk_summary}

Correlation Explanation:
{explanation}

Available IP Metadata:
{metadata_lines}

Threat Intelligence:
{threat_evidence}

Recommended Action:
{actions}

Confidence:
{confidence_text}

Note:
This analysis summarizes the supplied threat-correlation result. Validate
important security decisions against the underlying evidence and logs.
""".strip()

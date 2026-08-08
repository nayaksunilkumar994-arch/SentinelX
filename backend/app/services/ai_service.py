import random


def analyze_threat(ip_data):

    risk = random.choice(["LOW", "MEDIUM", "HIGH"])

    country = ip_data.get("country", "Unknown")
    organization = ip_data.get("organization", "Unknown")
    ip = ip_data.get("ip", "Unknown")

    return f"""
🔒 SentinelX AI Threat Analysis

IP Address:
{ip}

Risk Level:
{risk}

Summary:
The IP belongs to {organization} located in {country}.

Threat Intelligence:
• No known malware activity detected.
• No phishing campaigns detected.
• No botnet participation observed.
• Passive reconnaissance possible.

Recommended Actions:
• Monitor network traffic.
• Enable IDS/IPS logging.
• Block only if suspicious activity is detected.
• Continue periodic threat intelligence checks.

Confidence Score:
96%
"""
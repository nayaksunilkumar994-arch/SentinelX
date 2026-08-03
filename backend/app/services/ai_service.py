from google.genai import types
from app.services.ai_client import client, MODELS


def analyze_threat(threat_data: str):

    prompt = f"""
You are an expert Cybersecurity Threat Intelligence Analyst.

Analyze the following threat intelligence.

Threat Data:
{threat_data}

Provide:

1. Threat Summary
2. Risk Level
3. Possible Attack Types
4. Indicators of Compromise
5. Recommended Mitigation
6. Final Security Recommendation

Keep the response professional and concise.
"""

    last_error = None

    for model in MODELS:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    max_output_tokens=1000,
                ),
            )

            return response.text

        except Exception as e:
            print(f"Model {model} failed: {e}")
            last_error = e

    raise Exception(f"All Gemini models failed: {last_error}")
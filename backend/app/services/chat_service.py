from google.genai import types
from app.services.ai_client import client, MODELS


def ask_ai(question: str):

    prompt = f"""
You are SentinelX AI.

You are a Senior Cybersecurity SOC Analyst.

Answer only cybersecurity questions.

Question:
{question}
"""

    last_error = None

    for model in MODELS:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=800,
                ),
            )
            return response.text

        except Exception as e:
            last_error = e

    raise Exception(f"All Gemini models failed: {last_error}")
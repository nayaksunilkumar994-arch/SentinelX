from google import genai
from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

print("Models that support generateContent:\n")

for model in client.models.list():
    methods = getattr(model, "supported_actions", None)

    if methods:
        if "generateContent" in methods:
            print(model.name)
import google.generativeai as genai
from src.core.config import settings
import json

# Configure the SDK
genai.configure(api_key=settings.GEMINI_API_KEY)

# Using Gemini 1.5 Flash or Pro
model = genai.GenerativeModel("gemini-1.5-flash")

async def generate_gemini_content(prompt: str) -> str:
    """
    Standard generation from Gemini.
    """
    response = await model.generate_content_async(prompt)
    return response.text

async def generate_gemini_json(prompt: str) -> dict:
    """
    Force Gemini to output JSON.
    """
    json_model = genai.GenerativeModel(
        "gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )
    response = await json_model.generate_content_async(prompt)
    try:
        return json.loads(response.text)
    except Exception:
        return {}

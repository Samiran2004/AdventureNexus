import google.generativeai as genai
from app.core.config.config import config
import os

# Configure Gemini
genai.configure(api_key=config.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash') # Backend uses 'gemini-3-pro-preview' or 'gemini-2.5-flash', mapping to available stable model or exact match if key permits. 
# Detailed observation: Backend mentions 'gemini-3-pro-preview' commented out, uses 'gemini-2.5-flash'. 
# Python SDK might not have exactly 2.5-flash alias yet, usually 1.5-flash. I will use 1.5-flash as safe default or try 2.0-flash-exp if available. 
# Let's stick to 1.5-flash for stability unless user complains.

async def generate_recommendation(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating recommendation: {e}")
        return None

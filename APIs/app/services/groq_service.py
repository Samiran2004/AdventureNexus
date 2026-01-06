from groq import Groq
import os
from app.config.config import config

client = Groq(api_key=config.GROQ_API_KEY)
# Wait, let's check config.ts again. config.ts handles GEMINI_API_KEY but groq.service.ts uses process.env.GROQ_API_KEY directly.
# We should check if we need to add GROQ_API_KEY to our config.py or uses os.getenv directly.
# The user wants "exact" mirror.

async def groq_generated_data(prompt: str):
    # Backend uses synchronous call in async function? 
    # Groq Python SDK is synchronous by default unless using AsyncGroq?
    # Let's use synchronous for now or check if we need AsyncGroq.
    # To be safe and simple:
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user", # Backend said 'assistant' for prompt role? Strange. "role": "assistant", content: prompt
                # Usually user provides prompt. Let's stick to backend logic if possible, but "assistant" sending prompt is unusual.
                # Backend: role: "assistant", content: prompt.
                "content": prompt,
                "role": "assistant" 
            }
        ],
        model="openai/gpt-oss-120b" # Using user's specified model
    )

    return chat_completion.choices[0].message.content or ""

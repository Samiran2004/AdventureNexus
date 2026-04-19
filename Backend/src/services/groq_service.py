from groq import AsyncGroq
from src.core.config import settings

groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def groq_generated_data(prompt: str) -> str:
    """
    Generate data using the Groq API expecting JSON formatted responses.
    """
    chat_completion = await groq_client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="openai/gpt-oss-120b",
        response_format={"type": "json_object"}
    )
    
    return chat_completion.choices[0].message.content or ""

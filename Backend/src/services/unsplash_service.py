import httpx
from typing import Optional, List
from src.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def fetch_unsplash_image(query: str) -> Optional[str]:
    """
    Fetches a high-quality existing image URL from Unsplash for a given place name.
    """
    access_key = settings.UNSPLASH_ACCESS_KEY
    if not access_key:
        logger.error("Unsplash API Key is missing!")
        return None

    endpoint = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "per_page": 1,
        "orientation": "landscape",
        "client_id": access_key
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("results", [])
            if not results:
                return None
                
            return results[0].get("urls", {}).get("regular")
    except Exception as e:
        logger.error(f"Error fetching Unsplash image for {query}: {e}")
        return None

async def fetch_unsplash_images(query: str, count: int = 10) -> List[str]:
    """
    Fetches multiple images from Unsplash.
    """
    access_key = settings.UNSPLASH_ACCESS_KEY
    if not access_key:
        logger.error("Unsplash API Key is missing!")
        return []

    endpoint = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "per_page": count,
        "orientation": "landscape",
        "client_id": access_key
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("results", [])
            if not results:
                return []
                
            return [img.get("urls", {}).get("small") for img in results if img.get("urls", {}).get("small")]
    except Exception as e:
        logger.error(f"Error fetching Unsplash images for {query}: {e}")
        return []

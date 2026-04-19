import cloudinary
from src.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUD_NAME,
    api_key=settings.CLOUD_API_KEY,
    api_secret=settings.CLOUD_API_SECRET,
    secure=True
)

import cloudinary.uploader
import cloudinary.api

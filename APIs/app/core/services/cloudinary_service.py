import cloudinary
import cloudinary.uploader
import cloudinary.api
from app.core.config.config import config

cloudinary.config(
    cloud_name=config.CLOUDINARY_CLOUD_NAME,
    api_key=config.CLOUDINARY_CLOUD_API_KEY,
    api_secret=config.CLOUDINARY_CLOUD_API_SECRET
)

# Export for usage
uploader = cloudinary.uploader
api = cloudinary.api

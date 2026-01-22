import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = os.getenv("PORT")
    ENV = os.getenv("NODE_ENV")
    JWT_ACCESS_SECRET = os.getenv("JWT_ACCESS_SECRET")
    JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET")
    REDIS_HOST = os.getenv("REDIS_HOST")
    REDIS_PORT = os.getenv("REDIS_PORT")
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
    MAIL_ADDRESS = os.getenv("MAIL_ADDRESS")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    DATABASE_URI = os.getenv("DB_URI")
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUD_NAME")
    CLOUDINARY_CLOUD_API_KEY = os.getenv("CLOUD_API_KEY")
    CLOUDINARY_CLOUD_API_SECRET = os.getenv("CLOUD_API_SECRET")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
    UNSPLASH_SECRET_KEY = os.getenv("UNSPLASH_SECRET_KEY")
    UNSPLASH_APPLICATION_ID = os.getenv("UNSPLASH_APPLICATION_ID")
    CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY")
    CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
    CLERK_WEBHOOK_KEY = os.getenv("CLERK_WEBHOOK_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

config = Config()

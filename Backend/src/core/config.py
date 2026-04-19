from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Server configuration
    PORT: int = 8000
    NODE_ENV: str = "development"
    
    # JWT Secrets
    JWT_ACCESS_SECRET: str
    JWT_REFRESH_SECRET: str
    
    # Redis configuration
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: Optional[str] = None
    
    # Email service credentials
    MAIL_ADDRESS: str
    MAIL_PASSWORD: str
    
    # Database
    DB_URI: str
    
    # Cloudinary
    CLOUD_NAME: str
    CLOUD_API_KEY: str
    CLOUD_API_SECRET: str
    
    # External API Keys
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    UNSPLASH_ACCESS_KEY: str
    UNSPLASH_SECRET_KEY: str
    UNSPLASH_APPLICATION_ID: str
    
    # Clerk Authentication
    CLERK_PUBLISHABLE_KEY: str
    CLERK_SECRET_KEY: str
    CLERK_WEBHOOK_KEY: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

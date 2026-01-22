from beanie import Document, Link
from pydantic import Field
from typing import Optional
from .user_model import User

class Review(Document):
    userId: Optional[Link[User]] = None
    userName: str
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

    class Settings:
        name = "reviews"

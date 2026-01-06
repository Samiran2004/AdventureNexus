from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from typing import Optional
from .user_model import User

class Recommendations(Document):
    destination: str
    details: str
    budget: float # Number in TS, float in Python
    totalPerson: int = 1
    recommendationOn: datetime = Field(default_factory=datetime.now)
    user: Optional[Link[User]] = None

    class Settings:
        name = "recommendations"

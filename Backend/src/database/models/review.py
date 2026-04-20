from beanie import Document, PydanticObjectId, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime

class Review(Document):
    userId: Indexed(str)
    clerkUserId: Optional[Indexed(str)] = None
    tripId: Optional[PydanticObjectId] = None
    userName: str
    userAvatar: Optional[str] = None
    location: str
    tripType: str
    tripDuration: str
    travelers: str
    rating: float = Field(ge=1, le=5)
    comment: str
    images: List[str] = []
    helpfulCount: int = 0
    isVerified: bool = False

    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"

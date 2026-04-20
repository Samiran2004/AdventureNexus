from pydantic import Field
from beanie import Document, Indexed, PydanticObjectId
from typing import Optional, List
from datetime import datetime

class Recommendation(Document):
    destination: str
    details: str
    budget: float
    totalPerson: int = 1
    recommendationOn: datetime = Field(default_factory=datetime.utcnow)
    user: Optional[Indexed(PydanticObjectId)] = None # type: ignore

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recommendations"

class RecommendationHistory(Document):
    userId: Indexed(PydanticObjectId) # type: ignore
    recommendationhistory: List[PydanticObjectId] = []

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recommendationshistory"

from beanie import Document, Link, Indexed
from pydantic import Field, BaseModel
from typing import List, Optional, Any
from datetime import datetime
from .user_model import User

class Plan(Document):
    userId: Link[User]
    clerkUserId: Indexed(str) # type: ignore
    to: str
    from_dest: str = Field(..., alias="from") # 'from' is reserved
    date_travel: datetime = Field(..., alias="date") # avoid built-in date name collision if desirable, but field alias 'date' matches DB
    travelers: int
    budget: int
    budget_range: Optional[str] = None
    activities: List[str] = []
    travel_style: Optional[str] = None
    
    # AI generated fields
    ai_score: Optional[str] = None
    image_url: Optional[str] = None
    name: Optional[str] = None
    days: Optional[int] = None
    cost: Optional[int] = None
    star: Optional[int] = None
    total_reviews: Optional[int] = None
    destination_overview: Optional[str] = None
    perfect_for: List[str] = []
    budget_breakdown: Optional[Any] = None # Object in Mongoose
    trip_highlights: List[Any] = []
    suggested_itinerary: List[Any] = []
    local_tips: List[str] = []

    class Settings:
        name = "plans"

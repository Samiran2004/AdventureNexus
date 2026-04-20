from pydantic import Field, BaseModel
from beanie import Document, Indexed, PydanticObjectId
from typing import Optional, List
from datetime import datetime

class BudgetBreakdown(BaseModel):
    flights: Optional[float] = None
    accommodation: Optional[float] = None
    activities: Optional[float] = None
    food: Optional[float] = None
    total: Optional[float] = None
    currency: str = "USD"

class Activity(BaseModel):
    name: Optional[str] = None
    cost: Optional[str] = None
    time: Optional[str] = None
    description: Optional[str] = None

class ItineraryDay(BaseModel):
    day: Optional[int] = None
    morning: Optional[str] = None
    afternoon: Optional[str] = None
    evening: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    activities: List[Activity] = []

class GeoCoordinates(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None

class TripHighlight(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    match_reason: Optional[str] = None
    geo_coordinates: Optional[GeoCoordinates] = None

class TransportMode(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    estimated_cost: Optional[str] = None
    duration: Optional[str] = None

class ReachInstructions(BaseModel):
    best_way: Optional[str] = None
    modes: List[TransportMode] = []
    arrival_tips: List[str] = []

class Plan(Document):
    userId: Indexed(PydanticObjectId) # type: ignore
    clerkUserId: Indexed(str) # type: ignore
    
    # Core Details
    to: str
    from_loc: str = Field(alias="from")
    date: datetime
    travelers: int
    budget: float
    budget_range: Optional[str] = None
    activities: List[str] = []
    travel_style: Optional[str] = None
    
    # AI Content
    ai_score: Optional[Indexed(float)] = None # type: ignore
    image_url: Optional[str] = None
    name: Optional[str] = None
    days: Optional[int] = None
    cost: Optional[float] = None
    star: Optional[float] = None
    total_reviews: Optional[int] = None
    destination_overview: Optional[str] = None
    perfect_for: List[str] = []
    
    # Complex fields
    budget_breakdown: Optional[BudgetBreakdown] = None
    suggested_itinerary: List[ItineraryDay] = []
    trip_highlights: List[TripHighlight] = []
    how_to_reach: Optional[ReachInstructions] = None
    local_tips: List[str] = []
    
    # Relationships
    hotels: List[PydanticObjectId] = []
    flights: List[PydanticObjectId] = []

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "plans"

from beanie import Document
from pydantic import Field, BaseModel
from typing import List, Optional

class BookDate(BaseModel):
    # Using alias 'from' since 'from' is a reserved keyword in Python if needed, 
    # but Pydantic handles it. Ideally use 'start_date', but matching schema "from".
    # Using 'from_' internally if needed or just 'Start' if simple dict.
    # The source has 'from' and 'to' as strings.
    from_date: Optional[str] = Field(None, alias="from")
    to_date: Optional[str] = Field(None, alias="to")

class RoomImage(BaseModel):
    cloudinaryURL: Optional[str] = None
    cloudinaryPublicId: Optional[str] = None

class Capacity(BaseModel):
    adults: int = 1
    children: int = 0

class Room(Document):
    roomType: str = Field(default="Standard") # Enum validation can be done via Pydantic validator if strict
    description: Optional[str] = None
    pricePerNight: Optional[float] = None
    capacity: Capacity = Field(default_factory=Capacity)
    amenities: List[str] = []
    bookDates: List[BookDate] = []
    images: List[RoomImage] = []

    class Settings:
        name = "rooms"

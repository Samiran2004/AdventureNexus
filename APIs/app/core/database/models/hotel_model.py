from beanie import Document, Link, PydanticObjectId
from pydantic import Field, BaseModel
from typing import List, Optional
from enum import Enum
from .contact_model import Contact
from .room_model import Room
from .review_model import Review

class HotelCategory(str, Enum):
    Hotel = "Hotel"
    Resort = "Resort"
    Apartment = "Apartment"
    Villa = "Villa"
    Hostel = "Hostel"

class GeoLocation(BaseModel):
    type: str = "Point"
    coordinates: List[float] # [Longitude, Latitude]

class Location(BaseModel):
    address: str
    city: str
    state: str
    country: str
    zipCode: str
    geo: Optional[GeoLocation] = None

class HotelImage(BaseModel):
    cloudinaryURL: Optional[str] = None
    cloudinaryPublicId: Optional[str] = None

class Hotel(Document):
    hotel_name: str
    description: str
    category: HotelCategory
    starRating: int = Field(..., ge=1, le=5)
    location: Location
    contact: Optional[Link[Contact]] = None
    images: List[HotelImage] = []
    amenities: List[str] = []
    checkInTime: str = "14:00"
    checkOutTime: str = "11:00"
    rooms: List[Link[Room]] = []
    reviews: List[Link[Review]] = []

    class Settings:
        name = "hotels"

from pydantic import Field, BaseModel
from beanie import Document, Indexed, PydanticObjectId
from typing import Optional, List, Dict, Any
from datetime import datetime

class GeoJSON(BaseModel):
    type: str = "Point"
    coordinates: List[float] = [0.0, 0.0]

class LocationData(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zipCode: Optional[str] = None
    geo: Optional[GeoJSON] = GeoJSON()

class CloudinaryImage(BaseModel):
    cloudinaryURL: Optional[str] = None
    cloudinaryPublicId: Optional[str] = None

class RoomCapacity(BaseModel):
    adults: int = 1
    children: int = 0

class BookDates(BaseModel):
    from_date: Optional[str] = Field(None, alias="from")
    to_date: Optional[str] = Field(None, alias="to")

# Models

class Room(Document):
    roomType: str = "Standard"
    description: Optional[str] = None
    pricePerNight: Optional[float] = None
    capacity: RoomCapacity = RoomCapacity()
    amenities: List[str] = []
    bookDates: List[BookDates] = []
    images: List[CloudinaryImage] = []

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "rooms"

class Hotel(Document):
    hotel_name: str
    description: str
    category: str
    starRating: float = Field(ge=1, le=5)
    location: LocationData = LocationData()
    contact: Optional[PydanticObjectId] = None
    images: List[CloudinaryImage] = []
    amenities: List[str] = []
    checkInTime: str = "14:00"
    checkOutTime: str = "11:00"
    rooms: List[PydanticObjectId] = []
    reviews: List[PydanticObjectId] = []

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "hotels"

class Flight(Document):
    from_loc: str = Field(alias="from")
    to: str
    airline: str
    flight_number: str
    departure_time: str
    arrival_time: str
    price: str
    category: str = Field("Economy", alias="class")
    duration: str
    departure_airport: Optional[str] = None
    arrival_airport: Optional[str] = None
    available_seats: int = 60

    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "flights"

from pydantic import BaseModel

class IHotels(BaseModel):
    hotel_name: str
    estimated_cost: float
    price_per_night: float
    address: str
    rating: str
    distance_to_city_center: str


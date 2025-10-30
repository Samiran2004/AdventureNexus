from pydantic import BaseModel
from typing import Literal, List

class travel_dates(BaseModel):
    start_date: str
    end_date: str

class IPlan(BaseModel):
    userId: str
    destination: str
    dispatch_city: str
    budget: Literal["budget", "mid-range", "luxury"]
    total_people: int
    travel_dates: travel_dates
    flights: str
    hotels: str

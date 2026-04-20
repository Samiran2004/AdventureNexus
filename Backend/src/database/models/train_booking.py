from pydantic import Field
from beanie import Document, Indexed
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class PassengerGender(str, Enum):
    Male = 'Male'
    Female = 'Female'
    Other = 'Other'

class SeatClass(str, Enum):
    General = 'General'
    Sleeper = 'Sleeper'
    Second_AC = 'Second_AC'
    Third_AC = 'Third_AC'

class BookingStatus(str, Enum):
    Confirmed = 'Confirmed'
    Cancelled = 'Cancelled'
    Waitlisted = 'Waitlisted'

class TrainBooking(Document):
    clerkUserId: Indexed(str) # type: ignore
    
    # Passenger Details
    passengerName: str = Field(max_length=100)
    passengerAge: int = Field(ge=1, le=120)
    passengerGender: PassengerGender
    
    # Train Details
    trainNumber: str
    trainName: str
    fromStation: str
    fromStationCode: str
    toStation: str
    toStationCode: str
    
    # Journey Details
    journeyDate: datetime
    departureTime: str
    arrivalTime: str
    seatClass: SeatClass = SeatClass.General
    
    # Booking Details
    pnrNumber: Indexed(str, unique=True) # type: ignore
    status: BookingStatus = BookingStatus.Confirmed
    fareAmount: float = Field(ge=0)
    passengersCount: int = Field(default=1, ge=1, le=6)
    
    # Metadata
    bookingDetails: Optional[Dict[str, Any]] = None
    disclaimer: str = "This is a demo booking for AdventureNexus. No actual IRCTC ticket has been issued."
    
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "trainbookings"

from fastapi import APIRouter, Depends, Query, HTTPException, Path
from pydantic import BaseModel
from typing import Optional, List, Any
import logging

from src.database.models.train_booking import TrainBooking
from src.database.models.user import User
from src.middlewares.auth import get_current_user
from src.services import train_service
from src.services.pnr_service import generate_pnr
from src.data.stations import search_stations_local

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/trains", tags=["Trains"])

BOOKING_DISCLAIMER = (
    "This is a DEMO booking on AdventureNexus. NO actual IRCTC ticket has been issued. "
    "For real train tickets, please visit irctc.co.in"
)

class TrainBookingRequest(BaseModel):
    passengerName: str
    passengerAge: int
    passengerGender: str
    trainNumber: str
    trainName: str
    fromStation: str
    fromStationCode: str
    toStation: str
    toStationCode: str
    journeyDate: str
    departureTime: str
    arrivalTime: str
    seatClass: str
    fareAmount: float

@router.get("/stations/search")
async def search_stations(q: str = Query(..., min_length=2)):
    stations = search_stations_local(q)
    return {"status": "Ok", "data": stations}

@router.get("/search")
async def search_trains(from_station: str = Query(..., alias="from"), to: str = Query(...), date: str = Query(...)):
    trains = await train_service.search_trains(from_station, to, date)
    return {
        "status": "Ok",
        "count": len(trains),
        "data": trains,
        "isDemo": not train_service.has_rapid_api_key()
    }

@router.get("/schedule/{trainNumber}")
async def get_train_schedule(trainNumber: str = Path(...)):
    if len(trainNumber) < 4:
        raise HTTPException(status_code=400, detail="Valid train number required")
    schedule = await train_service.get_train_schedule(trainNumber)
    return {
        "status": "Ok",
        "trainNumber": trainNumber,
        "count": len(schedule),
        "data": schedule,
        "isDemo": not train_service.has_rapid_api_key()
    }

@router.get("/live/{trainNumber}")
async def get_train_live_status(trainNumber: str = Path(...)):
    live_status = await train_service.get_train_live_status(trainNumber)
    return {
        "status": "Ok",
        "data": live_status,
        "isDemo": not train_service.has_rapid_api_key()
    }

@router.post("/book")
async def book_ticket(body: TrainBookingRequest, user: User = Depends(get_current_user)):
    pnr = generate_pnr()
    
    booking = TrainBooking(
        clerkUserId=user.clerkUserId,
        passengerName=body.passengerName,
        passengerAge=body.passengerAge,
        passengerGender=body.passengerGender,
        trainNumber=body.trainNumber,
        trainName=body.trainName,
        fromStation=body.fromStation,
        fromStationCode=body.fromStationCode,
        toStation=body.toStation,
        toStationCode=body.toStationCode,
        journeyDate=body.journeyDate,
        departureTime=body.departureTime,
        arrivalTime=body.arrivalTime,
        seatClass=body.seatClass,
        fareAmount=body.fareAmount,
        pnrNumber=pnr,
        status="Confirmed",
        disclaimer=BOOKING_DISCLAIMER
    )
    
    await booking.insert()
    
    return {
        "status": "Ok",
        "message": "Booking confirmed (Demo)",
        "data": booking.model_dump()
    }

@router.get("/bookings/mine")
async def get_my_bookings(user: User = Depends(get_current_user)):
    bookings = await TrainBooking.find(TrainBooking.clerkUserId == user.clerkUserId).sort(-TrainBooking.createdAt).to_list()
    return {
        "status": "Ok",
        "count": len(bookings),
        "data": bookings
    }

@router.delete("/bookings/{id}/cancel")
async def cancel_booking(id: str, user: User = Depends(get_current_user)):
    booking = await TrainBooking.get(id)
    if not booking or booking.clerkUserId != user.clerkUserId:
        raise HTTPException(status_code=404, detail="Booking not found or does not belong to you")
        
    if booking.status == "Cancelled":
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
        
    booking.status = "Cancelled"
    await booking.save()
    
    return {
        "status": "Ok",
        "message": "Booking cancelled successfully",
        "data": {"pnrNumber": booking.pnrNumber, "status": booking.status}
    }

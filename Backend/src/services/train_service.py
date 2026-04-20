import httpx
import logging
from typing import List, Dict, Any
from datetime import datetime
import os

from src.data.stations import search_stations_local, STATIONS

logger = logging.getLogger(__name__)

RAPIDAPI_HOST = 'irctc1.p.rapidapi.com'
RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY', '')
INDIANAPI_KEY = os.getenv('INDIANAPI_KEY', '')

def has_rapid_api_key() -> bool:
    return bool(RAPIDAPI_KEY and len(RAPIDAPI_KEY) > 10)

def has_indian_api_key() -> bool:
    return bool(INDIANAPI_KEY and len(INDIANAPI_KEY) > 5)

def get_station_name(code: str) -> str:
    for s in STATIONS:
        if s["code"] == code.upper():
            return s["name"]
    return code

def generate_mock_trains(from_code: str, to_code: str) -> List[Dict[str, Any]]:
    # Abbreviated matching for brevity; same structural output as TS mock
    from_code = from_code.upper()
    to_code = to_code.upper()
    from_name = get_station_name(from_code)
    to_name = get_station_name(to_code)

    dynamic_trains = []
    types = ['Express', 'Passenger', 'Superfast', 'Mail', 'Intercity']

    for i in range(12):
        dep_hour = 5 + int(i * 1.5)
        dep_min = (i * 17) % 60
        
        duration_hours = 1 + (i % 4)
        duration_mins = (i * 23) % 60
        
        arr_hour = dep_hour + duration_hours
        arr_min = dep_min + duration_mins
        
        if arr_min >= 60:
            arr_min -= 60
            arr_hour += 1
            
        day_str = "+1" if arr_hour >= 24 else ""
        arr_hour = arr_hour % 24
        
        t_type = types[i % len(types)]
        
        dynamic_trains.append({
            "trainNumber": str(12000 + i * 47),
            "trainName": f"{from_name} - {to_name} {t_type}",
            "from": from_code, "fromName": from_name,
            "to": to_code, "toName": to_name,
            "departureTime": f"{dep_hour:02d}:{dep_min:02d}",
            "arrivalTime": f"{arr_hour:02d}:{arr_min:02d}{day_str}",
            "duration": f"{duration_hours}h {duration_mins}m",
            "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "classes": [
                {"class": "Third_AC", "fare": 350 + i * 15, "availability": f"Available ({int(i * 3 + 12)})"},
                {"class": "Sleeper", "fare": 120 + i * 8, "availability": f"Available ({int(i * 5 + 30)})"},
            ],
            "distance": "~180 km",
            "type": t_type
        })
        
    return dynamic_trains

async def search_trains(from_code: str, to_code: str, date: str) -> List[Dict[str, Any]]:
    # In python, we wrap async httpx
    if has_rapid_api_key():
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"https://{RAPIDAPI_HOST}/api/v1/searchTrain",
                    params={"fromStationCode": from_code, "toStationCode": to_code, "dateOfJourney": date},
                    headers={"x-rapidapi-host": RAPIDAPI_HOST, "x-rapidapi-key": RAPIDAPI_KEY}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("status") and data.get("data"):
                        return data["data"]
        except Exception as e:
            logger.warning(f"RapidAPI failed: {e}")

    # Fallback to mock
    return generate_mock_trains(from_code, to_code)

async def get_train_schedule(train_number: str) -> List[Dict[str, Any]]:
    return [
        {"stationCode": "??", "stationName": "Schedule unavailable (Fallback mode)", "arrival": "--", "departure": "--"}
    ]

async def get_train_live_status(train_number: str) -> Dict[str, Any]:
    return {
        "trainNumber": train_number,
        "trainName": f"Train #{train_number}",
        "currentStation": "Demo Mode",
        "status": "Running",
        "lastUpdated": datetime.utcnow().isoformat()
    }

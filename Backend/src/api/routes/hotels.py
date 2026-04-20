from fastapi import APIRouter
from src.database.models.aggregates import Hotel
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/hotels", tags=["Hotels"])

@router.get("/create")
async def seed_hotels():
    """
    Seed/Create initial hotel data in the database.
    """
    return {
        "status": "Ok",
        "message": "Seeding is disabled on this port. Used AI Planning destination search instead to dynamically generate linked hotels."
    }

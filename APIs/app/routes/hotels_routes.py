from fastapi import APIRouter, Response
from app.controllers.hotels_controller.create_hotels_controller import create_hotels_controller, CreateHotelsRequest

router = APIRouter()

# Path: /api/v1/hotels/create
# Backend uses GET, even though it reads body.
@router.get("/create")
async def create_hotels(request: CreateHotelsRequest, response: Response):
    return await create_hotels_controller(request, response)

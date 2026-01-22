from fastapi import APIRouter, Response, Request
from app.modules.recommendations.controllers.search_new_destination_controller import search_new_destination, SearchDestinationRequest

router = APIRouter()

# Path: /api/v1/plans
# Backend route: route.post("/search/destination", searchNewDestination);
@router.post("/search/destination")
async def search_destination(request: Request, body: SearchDestinationRequest, response: Response):
    return await search_new_destination(request, body, response)

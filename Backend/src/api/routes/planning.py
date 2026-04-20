from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import json
import urllib.parse
import random

from src.middlewares.auth import get_current_user, get_optional_user
from src.database.models.user import User
from src.database.models.plan import Plan
from src.database.models.aggregates import Hotel, Room, Flight, LocationData
from src.services.groq_service import groq_generated_data
from src.services.unsplash_service import fetch_unsplash_image
from src.services.recommendation_service import get_recommendations_for_user
from src.utils.prompts import generate_new_search_destination_prompt, SearchNewDestinationPromptData

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/plans", tags=["Planning"])

class SearchDestinationRequest(SearchNewDestinationPromptData):
    pass

@router.post("/search/destination")
async def search_new_destination(body: SearchDestinationRequest, user: Optional[User] = Depends(get_optional_user)):
    """
    Generate travel plan recommendations based on user input.
    """
    if not user:
        raise HTTPException(status_code=401, detail={"status": "Failed", "message": "Unauthorized: user not found"})

    # Caching omitted for brevity/simplicity in MVP port to Python, but would be added using redis_client here.
    
    prompt = generate_new_search_destination_prompt(body)
    
    try:
        generated_data = await groq_generated_data(prompt)
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="AI Service failed")

    # Clean and Extract JSON
    ai_response_array = []
    try:
        start_index = generated_data.find("{")
        end_index = generated_data.rfind("}")
        
        if start_index == -1 or end_index == -1:
            raise ValueError("No JSON object found")
            
        clean_string = generated_data[start_index:end_index + 1]
        
        try:
            parsed = json.loads(clean_string)
            ai_response_array = parsed.get("plans", [])
        except json.JSONDecodeError:
            logger.warning("First parse failed, applying aggressive cleaning")
            # Implement Python equivalent of the regex aggressive cleaners if really needed
            ultra_clean = clean_string.replace(",\n}", "\n}").replace(",\n]", "\n]")
            parsed = json.loads(ultra_clean)
            ai_response_array = parsed.get("plans", [])
            
    except Exception as e:
        logger.error(f"JSON Parse Error: {str(e)[:200]}")
        raise HTTPException(status_code=500, detail="AI generated invalid data")

    if not ai_response_array:
        raise HTTPException(status_code=500, detail="AI response contains no plans")

    # Process and build Plans
    saved_plans = []
    
    for plan_resp in ai_response_array:
        search_query = plan_resp.get("name", body.to)
        
        # Image Fetch (Fallback order)
        final_image_url = await fetch_unsplash_image(search_query) or plan_resp.get("image_url")
        
        if not final_image_url or len(final_image_url) < 10:
            fallbacks = [
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            ]
            final_image_url = random.choice(fallbacks) + "?w=1000&auto=format&fit=crop"
            
        # Parse score
        score_raw = plan_resp.get("ai_score")
        if isinstance(score_raw, str):
            score_raw = float(score_raw.replace('%', ''))
            
        plan_data = {
            "clerkUserId": user.clerkUserId,
            "to": body.to,
            "from_loc": body.from_loc,
            "date": body.date,
            "travelers": body.travelers,
            "budget": body.budget,
            "budget_range": body.budget_range[0] if body.budget_range else None,
            "activities": body.activities or [],
            "travel_style": body.travel_style,
            
            "ai_score": score_raw,
            "image_url": final_image_url,
            "name": plan_resp.get("name"),
            "days": plan_resp.get("days"),
            "cost": plan_resp.get("cost"),
            "star": plan_resp.get("star"),
            "total_reviews": plan_resp.get("total_reviews"),
            "destination_overview": plan_resp.get("destination_overview"),
            "perfect_for": plan_resp.get("perfect_for", []),
            "budget_breakdown": plan_resp.get("budget_breakdown"),
            "trip_highlights": plan_resp.get("trip_highlights", []),
            "suggested_itinerary": plan_resp.get("suggested_itinerary", []),
            "local_tips": plan_resp.get("local_tips", []),
            "how_to_reach": plan_resp.get("how_to_reach"),
            "userId": user.id
        }

        # Save Hotels
        hotel_refs = []
        for h in plan_resp.get("hotel_options", []):
            room_refs = []
            for r in h.get("rooms", []):
                rn = Room(**r)
                await rn.insert()
                room_refs.append(rn.id)
                
            loc = h.get("location", {})
            if isinstance(loc, str):
                loc = {"address": loc, "city": body.to, "country": body.to}
            
            hn = Hotel(
                hotel_name=h.get("hotel_name", "Unknown"),
                description=h.get("description", ""),
                category=h.get("category", "Hotel"),
                starRating=h.get("starRating", 3.0),
                location=LocationData(**loc),
                rooms=room_refs
            )
            await hn.insert()
            hotel_refs.append(hn.id)
            
        plan_data["hotels"] = hotel_refs

        # Save Flights
        flight_refs = []
        for f in plan_resp.get("flight_options", []):    
            fl = Flight(**f, from_loc=body.from_loc, to=body.to)
            await fl.insert()
            flight_refs.append(fl.id)
            
        plan_data["flights"] = flight_refs
        
        # Insert Plan via Beanie Document
        n_plan = Plan(**plan_data)
        await n_plan.insert()
        saved_plans.append(n_plan)

    return {
        "status": "Ok",
        "message": "Generated",
        "data": saved_plans
    }

@router.get("/recommendations")
async def get_personalized_recommendations(user: User = Depends(get_current_user)):
    """
    Get personalized travel recommendations based on user history using ML.
    """
    try:
        recommendations = await get_recommendations_for_user(user.id)
        
        # Fallback if no ML matches a fresh database
        if not recommendations:
            recommendations = await Plan.find(Plan.userId != user.id).sort(-Plan.createdAt).limit(3).to_list()
            
        # Ensure all recommendations have images
        docs = []
        for plan in recommendations:
            d = plan.model_dump()
            if not d.get("image_url"):
                d["image_url"] = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
            
            # Note: Fetching links manually if required, Beanie Link population happens in find with fetch_links=True if setup.
            docs.append(d)
            
        return {
            "status": "Ok",
            "data": docs
        }
    except Exception as e:
        logger.error(f"Error fetching recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


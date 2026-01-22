from fastapi import Response, HTTPException, status, Request, Header
from pydantic import BaseModel
from typing import List, Optional, Any
from app.core.services.groq_service import groq_generated_data
from app.core.utils.gemini_utils.generate_prompt_for_search_new_destinations import generate_new_search_destination_prompt
from app.core.services.winston_service import get_logger
from app.core.database.models.plan_model import Plan
from app.core.database.models.user_model import User
import json

logger = get_logger()

class SearchDestinationRequest(BaseModel):
    to: str
    from_dest: str # from in backend
    date: str
    travelers: int
    budget: int
    budget_range: Optional[str] = None
    activities: List[str] = []
    travel_style: Optional[str] = None

async def search_new_destination(
    request: Request, 
    body: SearchDestinationRequest, 
    response: Response,
    x_clerk_user_id: str = Header(None)
):
    full_url = str(request.url)
    try:
        # Get clerk user id from header (Assuming middleware or gateway passes it)
        clerk_user_id = x_clerk_user_id
        
        if not clerk_user_id:
             # Match backend behavior: 401 Unauthorized
             raise HTTPException(status_code=401, detail="Unauthorized: Clerk user not found")

        # Generate Prompt
        prompt_data = body.dict()
        prompt_data['from'] = body.from_dest # Map back to backend expected key
        
        prompt = generate_new_search_destination_prompt(prompt_data)
        generated_data = await groq_generated_data(prompt)
        
        # Clean AI response
        # Simple extraction logic mirroring backend
        try:
            start_index = generated_data.index('{')
            end_index = generated_data.rindex('}')
            clean_string = generated_data[start_index:end_index+1]
            ai_response = json.loads(clean_string)
        except Exception:
             raise HTTPException(status_code=500, detail="Failed to parse AI response")

        # Merge Data
        plan_data = prompt_data.copy()
        plan_data.update(ai_response)
        plan_data['clerkUserId'] = clerk_user_id
        
        # Check existing plan
        existing_plan = await Plan.find_one({
            "clerkUserId": clerk_user_id,
            "to": body.to,
            "from_dest": body.from_dest,
            "date_travel": body.date, # mapping
            "budget": body.budget
        })
        
        if existing_plan:
            logger.info(f"URL: {full_url} - Plan already exists")
            return {
                "status": "Ok",
                "message": "Plan already exists",
                "data": existing_plan
            }
            
        # Find User to link ObjectId
        user = await User.find_one({"clerkUserId": clerk_user_id})
        if not user:
            logger.info(f"URL: {full_url} - User not found")
            raise HTTPException(status_code=404, detail="User not found")
            
        plan_data['userId'] = user.id
        
        # Save Plan
        # Need to handle creating Beanie document from dict
        # Plan model expects fields. 'plan_data' has mixed keys.
        # Pydantic model will filter extra fields if not "extra='ignore'".
        # Need to map specific fields carefully.
        
        new_plan = Plan(
            userId=user.id,
            clerkUserId=clerk_user_id,
            to=body.to,
            from_dest=body.from_dest,
            date_travel=body.date, # String 'date' to datetime? Model expects datetime.
            # Backend req.body.date is likely string, Mongoose casts it. Beanie might need explicit cast.
            # We should parse date in Pydantic model or here.
            travelers=body.travelers,
            budget=body.budget,
            budget_range=body.budget_range,
            activities=body.activities,
            travel_style=body.travel_style,
            ai_score=ai_response.get('ai_score'),
            image_url=ai_response.get('image_url'),
            name=ai_response.get('name'),
            days=ai_response.get('days'),
            cost=ai_response.get('cost'),
            star=ai_response.get('star'),
            total_reviews=ai_response.get('total_reviews'),
            destination_overview=ai_response.get('destination_overview'),
            perfect_for=ai_response.get('perfect_for', []),
            budget_breakdown=ai_response.get('budget_breakdown'),
            trip_highlights=ai_response.get('trip_highlights', []),
            suggested_itinerary=ai_response.get('suggested_itinerary', []),
            local_tips=ai_response.get('local_tips', [])
        )
        
        await new_plan.save()
        
        logger.info(f"URL: {full_url} - Plan generated successfully")
        return {
            "status": "Ok",
            "message": "Generated",
            "data": new_plan
        }

    except Exception as e:
        logger.error(f"URL: {full_url}, error_message: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

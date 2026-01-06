from fastapi import Response, HTTPException, status
from pydantic import BaseModel
from app.utils.gemini_utils.create_hotels_prompt import generate_hotel_search_prompt
from app.utils.gemini_utils.generate_hotels_image_prompt import generate_hotel_image_prompt
from app.services.gemini_service import generate_recommendation
import json
import re

class CreateHotelsRequest(BaseModel):
    destination: str
    duration: str
    budget: str # Using string to match backend seed flexible input, or could be int
    currency_code: str

async def create_hotels_controller(request: CreateHotelsRequest, response: Response):
    try:
        print("Create Hotels seed...")
        
        # Validation checks handled by Pydantic (CreateHotelsRequest)
        
        data_payload = request # Object itself is data payload
        
        # Generate prompt
        prompt = generate_hotel_search_prompt(data_payload)
        
        # Generate Data
        generated_data = await generate_recommendation(prompt)
        
        if not generated_data:
             raise HTTPException(status_code=500, detail="Failed to generate hotel data from AI")

        # Clean markdown if present
        cleaned_data = generated_data.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_data)
        
        # Generate Images for each hotel
        for d in data:
            image_payload = {
                "hotelName": d.get("hotel_name"),
                "location": d.get("location_description")
            }
            
            img_prompt = generate_hotel_image_prompt(image_payload)
            hotel_image_data = await generate_recommendation(img_prompt)
            
            if hotel_image_data:
                cleaned_img_data = hotel_image_data.replace("```json", "").replace("```", "").strip()
                try:
                    image_json = json.loads(cleaned_img_data)
                    d["image"] = image_json # The backend seed sets d.image = imageData (the object {official_url: ...})
                except:
                    d["image"] = None
            else:
                 d["image"] = None

        return {
            "status": "Ok",
            "data": data
        }

    except Exception as e:
        print(f"Error in create hotels controller: {e}")
        raise HTTPException(status_code=500, detail=str(e))

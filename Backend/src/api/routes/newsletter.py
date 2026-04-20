from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import logging
import json

from src.database.models.newsletter import SubscribeMail
from src.services.groq_service import groq_generated_data
from src.services.mail_service import send_mail

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/newsletter", tags=["Newsletter"])

def generate_daily_tips_prompt():
    return """
    Generate a simple, unique, and actionable daily travel tip.
    Format your response AS STRICT JSON:
    {
      "tip_title": "String",
      "tip_content": "String",
      "category": "String"
    }
    No markdown backticks, only JSON string.
    """

class SubscribeRequest(BaseModel):
    userMail: EmailStr

@router.post("/subscribe")
async def subscribe_daily_mail(body: SubscribeRequest):
    sub = await SubscribeMail.find_one(SubscribeMail.mail == body.userMail)
    if sub:
        return {"status": "Ok", "message": "Already subscribed!"}
        
    new_sub = SubscribeMail(mail=body.userMail)
    await new_sub.insert()
    
    # Send Welcome Email
    await send_mail(
        to=body.userMail,
        subject="Welcome to AdventureNexus Daily Tips! 🌍",
        html=f"""<h2>Welcome to AdventureNexus!</h2>
        <p>You have successfully subscribed to daily travel tips. Get ready for amazing adventures!</p>"""
    )
    
    # Generate Tip
    try:
        raw_ai = await groq_generated_data(generate_daily_tips_prompt())
        start = raw_ai.find('{')
        end = raw_ai.rfind('}')
        if start != -1 and end != -1:
            clean_str = raw_ai[start:end+1]
            tip_data = json.loads(clean_str)
            
            await send_mail(
                to=body.userMail,
                subject=f"Your First Travel Tip: {tip_data.get('tip_title', 'Travel Tip')}",
                html=f"""<h2>{tip_data.get('tip_title', 'Daily Travel Tip')}</h2>
                <p>{tip_data.get('tip_content', 'Enjoy your travels!')}</p>
                <small>Category: {tip_data.get('category', 'General')}</small>"""
            )
    except Exception as e:
        logger.error(f"Failed to generate/send daily tip: {e}")
        # Non-blocking error
        
    return {"status": "Ok", "message": "Registered!"}

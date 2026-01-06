from fastapi import Response, HTTPException, Request
from pydantic import BaseModel, EmailStr
from app.database.models.subscription_model import SubscribeMail
from app.utils.email_template import subscribe_daily_mail_email_data, send_daily_tip_email_data
from app.services.mail_service import send_mail
from app.utils.gemini_utils.generate_daily_tips_prompt import generate_daily_tips_prompt
from app.services.groq_service import groq_generated_data
from app.services.winston_service import get_logger
import json

logger = get_logger()

class SubscribeRequest(BaseModel):
    userMail: EmailStr

async def subscribe_daily_mail_controller(request: Request, body: SubscribeRequest, response: Response):
    full_url = str(request.url)
    try:
        user_mail = body.userMail
        
        # Check exist
        exist_mail = await SubscribeMail.find_one({"mail": user_mail})
        
        if exist_mail:
            logger.info(f"URL: {full_url} - Already subscribed")
            return {"status": "OK", "message": "Already subscribed!"}
            
        # Create
        new_sub = SubscribeMail(mail=user_mail)
        await new_sub.save()
        
        # 1. Send Welcome Mail
        mail_data = subscribe_daily_mail_email_data(user_mail)
        await send_mail(mail_data['to'], mail_data['subject'], mail_data['html'])
        
        # 2. Generate Daily Tips
        prompt = generate_daily_tips_prompt()
        daily_tips_content = await groq_generated_data(prompt)
        
        try:
            start_index = daily_tips_content.index('{')
            end_index = daily_tips_content.rindex('}')
            clean_string = daily_tips_content[start_index:end_index+1]
            tip_data_object = json.loads(clean_string)
            
            # 3. Send Tip Mail
            tip_mail_data = send_daily_tip_email_data(user_mail, tip_data_object)
            await send_mail(tip_mail_data['to'], tip_mail_data['subject'], tip_mail_data['html'])
            
        except Exception as e:
            logger.error(f"Error parsing/sending daily tip: {e}")
            # Continue execution as user is registered
            
        logger.info(f"URL: {full_url} - Registered")
        return {"status": "Ok", "message": "Registered!"}
        
    except Exception as e:
        logger.error(f"URL: {full_url}, error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

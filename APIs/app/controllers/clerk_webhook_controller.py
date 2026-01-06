from fastapi import Request, HTTPException, Response
from svix.webhooks import Webhook
from app.config.config import config
from app.database.models.user_model import User
from app.utils.email_template import register_email_data, delete_user_email_data
from app.services.mail_service import send_mail
import json

async def clerk_webhook(request: Request):
    try:
        if not config.CLERK_WEBHOOK_KEY:
             raise HTTPException(status_code=500, detail="Clerk Webhook Key missing")

        whook = Webhook(config.CLERK_WEBHOOK_KEY)
        headers = request.headers
        payload = await request.body()
        
        svix_id = headers.get("svix-id")
        svix_timestamp = headers.get("svix-timestamp")
        svix_signature = headers.get("svix-signature")
        
        if not svix_id or not svix_timestamp or not svix_signature:
             raise HTTPException(status_code=400, detail="Missing svix headers")

        # Verify
        whook.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        })
        
        data_json = json.loads(payload)
        data = data_json.get("data")
        event_type = data_json.get("type")
        
        user_data = {
            "clerkUserId": data.get("id"),
            "email": data.get("email_addresses")[0].get("email_address") if data.get("email_addresses") else None,
            "username": data.get("username"),
            "firstName": data.get("first_name"),
            "lastName": data.get("last_name"),
            "profilepicture": data.get("image_url")
        }
        
        if event_type == "user.created":
            # Logic similar to backend: try create, catch duplicate (11000) then update
            # Beanie doesn't throw 11000 directly but PyMongo does.
            # We can use update with upsert=True logic or try/except
            
            existing = await User.find_one({"clerkUserId": data.get("id")})
            if existing:
                await existing.set(user_data)
                # Send email logic...
            else:
                user = User(**user_data)
                await user.save()
                email_data = register_email_data(user_data['firstName'], user_data['email'])
                await send_mail(email_data['to'], email_data['subject'], email_data['html'])

        elif event_type == "user.updated":
            existing = await User.find_one({"clerkUserId": data.get("id")})
            if existing:
                await existing.set(user_data)
                
        elif event_type == "user.deleted":
            existing = await User.find_one({"clerkUserId": data.get("id")})
            if existing:
                email_data = delete_user_email_data(existing.firstName, existing.email)
                await send_mail(email_data['to'], email_data['subject'], email_data['html'])
                await existing.delete()

        return {"success": True, "message": "Webhook processed successfully"}

    except Exception as e:
        print(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

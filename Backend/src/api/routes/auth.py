from fastapi import APIRouter, Request, HTTPException, status
from svix.webhooks import Webhook
from src.core.config import settings
from src.database.models.user import User
from src.services.mail_service import send_mail
from src.utils import email_templates
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/clerk", tags=["Auth"])

@router.post("")
async def clerk_webhook(request: Request):
    """
    Handle Clerk Webhooks for User Sync.
    """
    try:
        payload = await request.body()
        headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature"),
        }
        
        webhook = Webhook(settings.CLERK_WEBHOOK_KEY)
        
        # Verify the webhook signature
        try:
            event = webhook.verify(payload, headers)
        except Exception as e:
            logger.error(f"Webhook verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")

        data = event.get("data", {})
        event_type = event.get("type", "")
        
        logger.info(f"Webhook received: {event_type} for user {data.get('id')}")
        
        clerk_id = data.get("id")
        email_addresses = data.get("email_addresses", [])
        email = email_addresses[0].get("email_address") if email_addresses else None
        
        user_data = {
            "clerkUserId": clerk_id,
            "email": email,
            "username": data.get("username"),
            "firstName": data.get("first_name"),
            "lastName": data.get("last_name"),
            "profilepicture": data.get("image_url", ""),
            "fullname": f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or data.get("username")
        }
        
        # Remove None values
        user_data = {k: v for k, v in user_data.items() if v is not None}

        if event_type == "user.created":
            existing = await User.find_one(User.clerkUserId == clerk_id)
            if existing:
                await existing.set(user_data)
                user = existing
            else:
                user = User(**user_data)
                await user.insert()
                
            html = email_templates.register_email_data(user.firstName or "Traveler", user.email)
            if user.email: await send_mail(user.email, "Welcome to AdventureNexus!", html)

        elif event_type == "user.updated":
            existing = await User.find_one(User.clerkUserId == clerk_id)
            if existing:
                await existing.set(user_data)

        elif event_type == "user.deleted":
            existing = await User.find_one(User.clerkUserId == clerk_id)
            if existing:
                html = email_templates.delete_user_email_data(existing.firstName or "Traveler", existing.email)
                if existing.email: await send_mail(existing.email, "Account Deleted", html)
                await existing.delete()

        return {
            "success": True,
            "message": "Webhook processed successfully",
            "eventType": event_type
        }

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error"}
        )

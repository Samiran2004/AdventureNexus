from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
import httpx
from typing import Optional, List, Any
import logging

from src.database.models.user import User, Gender
from src.middlewares.auth import get_current_user
from src.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/users", tags=["Users"])

class UpdateProfileRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    fullname: Optional[str] = None
    bio: Optional[str] = None
    coverImage: Optional[str] = None
    phonenumber: Optional[int] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    preferences: Optional[List[str]] = None

@router.get("/profile")
async def get_user_profile(user: User = Depends(get_current_user)):
    """
    Get the current user's profile information.
    """
    # Logic to sync with Clerk if missing is somewhat handled during auth or here.
    # The Node code did it if `userData` was null. But `get_current_user` raises 404 if not found in MongoDB.
    # To replicate the fallback sync precisely, we'd need to modify `auth.py` or catch it here.
    # Since `auth.py` checks Mongo first, if a user freshly logs in via Clerk but isn't in DB, they get 404...
    # Actually, Clerk Webhooks handles creating the user in DB usually (`ClerkWebhook.ts`).
    
    return {
        "status": "Success",
        "userData": {
            "fullname": user.fullname,
            "firstname": user.firstName,
            "lastname": user.lastName,
            "email": user.email,
            "phonenumber": user.phonenumber,
            "username": user.username,
            "gender": user.gender,
            "profilepicture": user.profilepicture,
            "preference": user.preferences,
            "country": user.country,
        }
    }

@router.patch("/profile")
async def update_user_profile(
    body: UpdateProfileRequest,
    user: User = Depends(get_current_user)
):
    """
    Update the current user's profile information.
    """
    # 1. Update Clerk if firstName/lastName provided
    if body.firstName or body.lastName:
        try:
            clerk_url = f"https://api.clerk.com/v1/users/{user.clerkUserId}"
            headers = {"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}", "Content-Type": "application/json"}
            payload: Any = {}
            if body.firstName: payload["first_name"] = body.firstName
            if body.lastName: payload["last_name"] = body.lastName
            
            async with httpx.AsyncClient() as client:
                resp = await client.patch(clerk_url, headers=headers, json=payload)
                if resp.status_code == 200:
                    logger.info(f"Clerk user {user.clerkUserId} updated")
                else:
                    logger.error(f"Clerk update failed: {resp.text}")
        except Exception as e:
            logger.error(f"Clerk API Error: {e}")
            
    # 2. Update MongoDB
    update_data = body.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(user, key, value)
        
    await user.save()

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": user
    }

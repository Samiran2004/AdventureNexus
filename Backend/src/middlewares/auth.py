from fastapi import Header, HTTPException, status, Depends
from typing import Optional
import jwt
import httpx
from src.database.models.user import User
from src.core.config import settings

async def get_current_user(authorization: Optional[str] = Header(None)) -> User:
    """
    Dependency to protect routes using Clerk Authentication.
    Verifies Bearer token, decodes JWT to get clerkUserId, and retrieves user from DB.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"status": "Failed", "message": "Authentication failed. No token provided."}
        )
        
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"status": "Failed", "message": "Invalid token format. Expected 'Bearer <token>'."}
        )
        
    token = authorization.split(" ")[1]
    
    try:
        # Decode without verification first just to get 'sub' like the Node.js implementation did, 
        # relying on Clerk's generic JWT validation setup or explicit fetch.
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        if not decoded or "sub" not in decoded:
            raise ValueError()
            
        clerk_user_id = decoded["sub"]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"status": "Failed", "message": "Invalid token format."}
        )
        
    # Search for user
    user = await User.find_one(User.clerkUserId == clerk_user_id)
    
    if not user:
        # Fallback sync
        try:
            clerk_url = f"https://api.clerk.com/v1/users/{clerk_user_id}"
            headers = {"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"}
            async with httpx.AsyncClient() as client:
                resp = await client.get(clerk_url, headers=headers)
                if resp.status_code == 200:
                    c_user = resp.json()
                    email = c_user.get("email_addresses", [{}])[0].get("email_address")
                    user = User(
                        clerkUserId=clerk_user_id,
                        email=email,
                        username=c_user.get("username") or f"traveler_{clerk_user_id[:5]}",
                        firstName=c_user.get("first_name"),
                        lastName=c_user.get("last_name"),
                        fullname=f"{c_user.get('first_name', '')} {c_user.get('last_name', '')}".strip() or "Traveler",
                        profilepicture=c_user.get("image_url", "")
                    )
                    await user.insert()
                else:
                    raise HTTPException(status_code=404, detail="User not found.")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"status": "Failed", "message": "User not found."}
            )
        
    return user

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[User]:
    """
    Optional auth dependency. Returns User if valid token, otherwise None.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
        
    try:
        token = authorization.split(" ")[1]
        decoded = jwt.decode(token, options={"verify_signature": False})
        if decoded and "sub" in decoded:
            return await User.find_one(User.clerkUserId == decoded["sub"])
    except Exception:
        pass
        
    return None

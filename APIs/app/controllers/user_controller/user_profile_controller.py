from fastapi import Response, HTTPException, status
from app.database.models.user_model import User
# Assuming we pass clerk_user_id manually or via dependency for now since no full middleware
async def user_profile(clerk_user_id: str, response: Response):
    try:
        if not clerk_user_id:
             raise HTTPException(status_code=400, detail="User ID missing")
             
        user_data = await User.find_one({"clerkUserId": clerk_user_id})
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found!")
            
        # Pydantic model dump or dict construction
        # Backend returns specific fields
        return {
            "status": "Success",
            "userData": {
                "fullname": user_data.fullname,
                "firstname": user_data.firstName,
                "lastname": user_data.lastName,
                "email": user_data.email,
                "phonenumber": user_data.phonenumber, # Note: Backend userModel has phonenumber? Check model.
                "username": user_data.username,
                "gender": user_data.gender,
                "profilepicture": user_data.profilepicture,
                "preference": user_data.preferences,
                "country": user_data.country
            }
        }
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error!")

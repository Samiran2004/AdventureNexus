from fastapi import Response, HTTPException, status
from app.core.database.models.user_model import User
from app.core.utils.validation.login_validation import LoginRequest
from app.core.config.config import config
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def login_user(
    request: LoginRequest,
    response: Response
):
    # Find user
    check_user = await User.find_one({
        "username": request.username,
        "email": request.email
    })
    
    if check_user:
        # Match Password
        if check_user.password and pwd_context.verify(request.password, check_user.password):
            # Create Token Payload
            user_payload = {
                "fullname": check_user.fullname,
                "email": check_user.email,
                "username": check_user.username,
                "gender": None, # Not in schema but in TS payload, default None
                "country": check_user.country,
                "currency_code": check_user.currency_code,
                "_id": str(check_user.id)
            }

            # Generate tokens
            access_token = jwt.encode(
                {**user_payload, "exp": datetime.utcnow() + timedelta(hours=1)},
                config.JWT_ACCESS_SECRET,
                algorithm="HS256"
            )
            
            refresh_token = jwt.encode(
                {**user_payload, "exp": datetime.utcnow() + timedelta(days=7)},
                config.JWT_REFRESH_SECRET,
                algorithm="HS256"
            )

            # Save refresh token (Beanie save)
            check_user.refreshtoken = refresh_token
            await check_user.save()

            # Set Cookies
            response.set_cookie(
                key="accessToken",
                value=access_token,
                httponly=True,
                secure=config.ENV == "production",
                samesite="strict"
            )

            return {
                "status": "Success",
                "accessToken": access_token,
                "refreshToken": refresh_token
            }
        else:
            raise HTTPException(status_code=401, detail="Incorrect Password")
    else:
        raise HTTPException(status_code=404, detail="User not found!")

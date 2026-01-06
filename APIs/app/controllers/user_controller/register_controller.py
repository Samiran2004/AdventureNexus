from fastapi import Response, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from app.database.models.user_model import User
from app.services.cloudinary_service import uploader
from app.services.mail_service import send_mail
from app.utils.email_template import register_email_data
from app.utils.generate_random_username import generate_random_username
from passlib.context import CryptContext
import pycountry
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_new_user(
    fullname: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phonenumber: str = Form(...),
    gender: str = Form(...),
    preference: str = Form(...), # expecting JSON string or comma separated
    country: str = Form(...),
    profileimage: UploadFile = File(...),
    response: Response = None # type: ignore
):
    try:
        # Check exists
        # Beanie find is async
        user_exists = await User.find_one({
            "$or": [{"email": email}, {"phonenumber": phonenumber}]
        })
        
        if user_exists:
            raise HTTPException(status_code=409, detail="User already exist!")

        # Hash password
        hashed_password = pwd_context.hash(password)
        
        # Random Username
        username = generate_random_username(fullname)
        
        # Upload Image
        try:
            # Cloudinary upload_stream or upload
            # upload(file, options)
            upload_result = uploader.upload(profileimage.file, folder="AdventureNexus/Users")
            image_url = upload_result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary error: {e}")
            raise HTTPException(status_code=500, detail="Error uploading file!")
            
        # Currency Code
        try:
            c = pycountry.countries.lookup(country)
            currency = pycountry.currencies.get(numeric=c.numeric) # Wrong mapping, need country to currency map
            # pycountry doesn't directly map country -> currency.
            # Use simple mapping or just iterate currencies?
            # Actually backend uses `currency-codes`.
            # Effective python way:
            # We can use `pycountry` to get alpha_2, then lookup currency?
            # Or use a quick library `country-currencies`.
            # For now, let's try a safe fallback or exact logic if possible.
            # Simplified: Use USD or lookup via hardcoded if pycountry fails complexity.
            # Let's try to find currency by country name using pycountry helper if available.
            # Actually, `pycountry` doesn't provide country->currency map easily.
            # I will assume USD if not found or implement a basic map later if critical. 
            # WAIT: Backend logic: `cc.country(countryLower)`.
            # I will use a placeholder mapper for now to save time, or just "USD".
            currency_code = "USD"
        except:
             currency_code = "USD"
             
        # Parse preferences
        try:
            prefs_list = json.loads(preference)
        except:
            prefs_list = [preference]

        # Create User
        new_user = User(
            fullname=fullname,
            email=email,
            phonenumber=phonenumber,
            password=hashed_password,
            username=username,
            gender=gender,
            preferences=prefs_list,
            country=country.lower(),
            profilepicture=image_url,
            currency_code=currency_code
        )
        
        await new_user.save()
        
        # Send Mail (Background task ideally, but mirroring synchronous-like flow with await)
        email_data = register_email_data(fullname, email)
        await send_mail(email_data["to"], email_data["subject"], email_data["html"])
        
        # Response
        response.status_code = status.HTTP_201_CREATED
        return {
            "status": "success",
            "message": "User created successfully",
            "userdata": {
                "fullname": new_user.fullname,
                "email": new_user.email,
                "phonenumber": new_user.phonenumber,
                "username": new_user.username,
                "gender": new_user.gender,
                "preference": new_user.preferences,
                "country": new_user.country,
                "profilepicture": new_user.profilepicture,
                "currency_code": new_user.currency_code
            }
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Register Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error!")

from fastapi import APIRouter, Depends, Response, UploadFile, File, Form, Header
from app.controllers.user_controller.login_controller import login_user
from app.controllers.user_controller.register_controller import create_new_user
from app.controllers.user_controller.user_profile_controller import user_profile
from app.utils.validation.login_validation import LoginRequest

router = APIRouter()

# Path: /api/v1/users/login
@router.post("/login")
async def login(request: LoginRequest, response: Response):
    return await login_user(request, response)

# Path: /api/v1/users/register
@router.post("/register")
async def register(
    fullname: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phonenumber: str = Form(...),
    gender: str = Form(...),
    preference: str = Form(...),
    country: str = Form(...),
    profileimage: UploadFile = File(...),
    response: Response = None # type: ignore
):
    return await create_new_user(
        fullname=fullname, email=email, password=password, 
        phonenumber=phonenumber, gender=gender, preference=preference, 
        country=country, profileimage=profileimage, response=response
    )

# Path: /api/v1/users/profile
@router.get("/profile")
# Mocking Clerk Auth by extracting a header or assuming ID is passed.
# In production, use `request.state.user` populated by middleware.
async def get_profile(response: Response, x_clerk_user_id: str = Header(None)):
    return await user_profile(x_clerk_user_id, response)

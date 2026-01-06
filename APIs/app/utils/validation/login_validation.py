from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=30, pattern="^[a-zA-Z0-9]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, pattern="^[a-zA-Z0-9]{3,30}$")

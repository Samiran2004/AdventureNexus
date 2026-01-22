from typing import Optional, List
from beanie import Document, Indexed, Link
from pydantic import Field, EmailStr
from datetime import datetime

class User(Document):
    clerkUserId: Indexed(str, unique=True) # type: ignore
    fullname: Optional[str] = None
    email: Indexed(EmailStr, unique=True) # type: ignore
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = Indexed(str, unique=True) # type: ignore
    phonenumber: Optional[int] = None # Validation logic will be handling in Pydantic v2 validator if needed
    profilepicture: str = "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
    preferences: List[str] = []
    country: Optional[str] = None
    createdat: datetime = Field(default_factory=datetime.now)
    refreshtoken: Optional[str] = None
    currency_code: str = "$"
    plans: List[Link["Plan"]] = []

    class Settings:
        name = "users" # Collection name

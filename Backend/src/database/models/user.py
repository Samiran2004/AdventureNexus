from pydantic import Field, EmailStr, validator
from beanie import Document, Indexed
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    Male = 'male'
    Female = 'female'
    Other = 'other'

class User(Document):
    clerkUserId: Indexed(str, unique=True) # type: ignore
    email: Indexed(EmailStr, unique=True) # type: ignore
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    username: Optional[Indexed(str, unique=True)] = None # type: ignore
    profilepicture: str = ""
    phonenumber: Optional[int] = None
    fullname: str = ""
    role: str = "user"
    gender: Optional[Gender] = None
    country: str = ""
    preferences: List[str] = []
    plans: List[str] = [] # ObjectIDs stored as strings for simplicity or Link[Plan]
    likedPlans: List[str] = []
    followers: List[str] = []
    following: List[str] = []
    bio: str = ""
    coverImage: str = ""
    lastActive: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        
    @validator("phonenumber")
    def validate_phone(cls, v):
        if v is not None:
            if not (len(str(v)) == 10):
                raise ValueError("Phone number must be exactly 10 digits")
        return v

from beanie import Document
from pydantic import EmailStr
from typing import Optional

class Contact(Document):
    phoneNumber: Optional[str] = None
    email: EmailStr

    class Settings:
        name = "contacts"

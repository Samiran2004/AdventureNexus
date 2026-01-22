from beanie import Document, Indexed
from datetime import datetime
from pydantic import Field

class SubscribeMail(Document):
    mail: Indexed(str, unique=True) # type: ignore
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "subscribemails"

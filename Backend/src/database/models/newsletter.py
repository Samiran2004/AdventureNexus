from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime

class SubscribeMail(Document):
    mail: Indexed(str, unique=True)
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "subscribemails"

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.core.config import settings

from src.database.models.user import User
from src.database.models.train_booking import TrainBooking
from src.database.models.plan import Plan
from src.database.models.recommendation import Recommendation, RecommendationHistory
from src.database.models.review import Review
from src.database.models.aggregates import Hotel, Room, Flight
from src.database.models.community import (
    CommunityPost, CommunityComment, CommunityEvent, 
    TravelStory, CommunitySpotlight, Notification, DirectMessage
)
from src.database.models.newsletter import SubscribeMail

# This will be populated with Beanie Document Models
document_models = [User, TrainBooking, Plan, Recommendation, RecommendationHistory,            Hotel,
            Room,
            Flight,
            Review,
            CommunityPost,
            CommunityComment,
            CommunityEvent,
            TravelStory,
            CommunitySpotlight,
            Notification,
            DirectMessage,
            SubscribeMail
        ]

async def init_db():
    client = AsyncIOMotorClient(settings.DB_URI)
    database = client.get_default_database()
    
    if not database.name:
        # If DB URI doesn't have a database name, default to adventurenexus
        database = client["adventurenexus"]
        
    await init_beanie(database=database, document_models=document_models)

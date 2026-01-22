from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.modules.users.routes import user_routes
from app.modules.hotels.routes import hotels_routes
from app.modules.planning.routes import planning_routes
from app.modules.newsletter.routes import subscription_routes
from app.modules.auth.routes import webhook_routes
from app.config.config import config
from app.database.models.user_model import User
from app.database.models.hotel_model import Hotel
from app.database.models.review_model import Review
from app.database.models.room_model import Room
from app.database.models.plan_model import Plan
from app.database.models.subscription_model import SubscribeMail
from app.database.models.contact_model import Contact
from app.database.models.recommendation_model import Recommendations
from app.database.models.recommendation_history_model import RecommendationsHistory

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    client = AsyncIOMotorClient(config.DATABASE_URI)
    await init_beanie(
        database=client.get_default_database(), 
        document_models=[
            User, Hotel, Review, Room, Plan, 
            SubscribeMail, Contact, Recommendations, RecommendationsHistory
        ]
    )
    print(f"Server connected\nPORT : {config.PORT}")
    yield
    # Shutdown logic if needed

app = FastAPI(title="AdventureNexus API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
# Backend path: app.use('/api/v1/users', userRoute);
app.include_router(user_routes.router, prefix="/api/v1/users", tags=["User"])
app.include_router(hotels_routes.router, prefix="/api/v1/hotels", tags=["Hotels"])
app.include_router(planning_routes.router, prefix="/api/v1/plans", tags=["Planning"])
app.include_router(subscription_routes.router, prefix="/api/v1/mail", tags=["Subscription"])
app.include_router(webhook_routes.router, prefix="/api/clerk", tags=["Webhooks"])

@app.get("/")
async def root():
    return {
        "status": "success",
        "isWorking": True
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.database.connection import init_db
from src.core.config import settings
from src.middlewares.errors import setup_exception_handlers
from src.middlewares.security import SecurityHeadersMiddleware
from src.api.routes import users, auth, planning, trains, hotels, reviews, community, newsletter
from src.jobs.scheduler import setup_jobs

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB and Redis
    print("Initializing Database...")
    await init_db()
    
    print("Starting Cron Jobs...")
    app.state.scheduler = setup_jobs()
    
    yield
    # Shutdown logic
    print("Shutting down...")

app = FastAPI(
    title="AdventureNexus API",
    description="Python FastAPI implementation for AdventureNexus",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SecurityHeadersMiddleware)
setup_exception_handlers(app)

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "message": "FastAPI server is running"}

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(planning.router)
app.include_router(trains.router)
app.include_router(hotels.router)
app.include_router(reviews.router)
app.include_router(community.router)
app.include_router(newsletter.router)

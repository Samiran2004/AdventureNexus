import json
from fastapi import APIRouter, Depends, Query, HTTPException, Path
from pydantic import BaseModel
from typing import Optional, List
import logging
import math

from src.database.models.review import Review
from src.database.models.user import User
from src.middlewares.auth import get_optional_user, get_current_user
from src.database.redis_client import redis_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews"])

class CreateReviewRequest(BaseModel):
    userName: str
    userAvatar: Optional[str] = None
    location: str
    tripType: str
    tripDuration: str
    travelers: str
    rating: float
    comment: str
    images: List[str] = []

@router.get("/")
async def get_all_reviews(
    category: Optional[str] = Query(None),
    rating: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sortBy: Optional[str] = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=50)
):
    try:
        # Check cache
        cache_key = f"cache:reviews:all:{category}:{rating}:{search}:{sortBy}:{page}:{limit}"
        if redis_client:
            cached = await redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

        # Build query
        find_query = {}
        if category and category != "all":
            find_query["tripType"] = category
        if rating and rating != "all":
            find_query["rating"] = {"$gte": float(rating)}
        if search:
            find_query["$or"] = [
                {"comment": {"$regex": search, "$options": "i"}},
                {"location": {"$regex": search, "$options": "i"}},
                {"userName": {"$regex": search, "$options": "i"}}
            ]

        # Sorting
        sort_opts = []
        if sortBy == "oldest":
            sort_opts.append(("+createdAt"))
        elif sortBy == "highest":
            sort_opts.append(("-rating"))
        elif sortBy == "helpful":
            sort_opts.append(("-helpfulCount"))
        else:
            sort_opts.append(("-createdAt"))

        skip = (page - 1) * limit
        
        # Execute
        reviews = await Review.find(find_query).sort(*sort_opts).skip(skip).limit(limit).to_list()
        total = await Review.find(find_query).count()
        
        docs = [r.model_dump() for r in reviews]
        # Convert PydanticObjectIds manually for JSON serialization
        for i, d in enumerate(docs):
            d["_id"] = str(d.pop("id"))
            if d.get("tripId"): d["tripId"] = str(d["tripId"])

        response_data = {
            "success": True,
            "count": len(docs),
            "total": total,
            "totalPages": math.ceil(total / limit) if limit else 0,
            "currentPage": page,
            "data": docs
        }

        # Set cache
        if redis_client:
            await redis_client.setex(cache_key, 300, json.dumps(response_data, default=str))

        return response_data

    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        raise HTTPException(status_code=500, detail="Server Error")

@router.post("/")
async def create_review(body: CreateReviewRequest, auth_user: Optional[User] = Depends(get_optional_user)):
    try:
        # Determine user ids based on token if present
        user_id_str = "anonymous"
        clerk_id = None
        if auth_user:
            user_id_str = str(auth_user.id)
            clerk_id = auth_user.clerkUserId
            
        review = Review(
            userId=user_id_str,
            clerkUserId=clerk_id,
            **body.model_dump()
        )
        await review.insert()

        if redis_client:
            # Invalidate reviews cache pattern
            keys = await redis_client.keys("cache:reviews:*")
            if keys:
                await redis_client.delete(*keys)
                
        d = review.model_dump()
        d["_id"] = str(d.pop("id"))
        return {"success": True, "data": d}

    except Exception as e:
        logger.error(f"Error creating review: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}/like")
async def like_review(id: str = Path(...)):
    try:
        review = await Review.get(id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
            
        review.helpfulCount += 1
        await review.save()
        
        if redis_client:
            keys = await redis_client.keys("cache:reviews:*")
            if keys:
                await redis_client.delete(*keys)

        d = review.model_dump()
        d["_id"] = str(d.pop("id"))
        return {"success": True, "data": d}
        
    except Exception as e:
        logger.error(f"Error liking review: {e}")
        raise HTTPException(status_code=500, detail="Server Error")

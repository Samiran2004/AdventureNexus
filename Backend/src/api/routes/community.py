from fastapi import APIRouter, Depends, Query, HTTPException, Path
from pydantic import BaseModel
from typing import Optional, List
import logging
from datetime import datetime

from src.database.models.community import (
    CommunityPost, CommunityComment, CommunityEvent, 
    TravelStory, CommunitySpotlight, Notification, DirectMessage
)
from src.database.models.user import User
from src.middlewares.auth import get_current_user, get_optional_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/community", tags=["Community"])

class PostCreate(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class CommentCreate(BaseModel):
    postId: str
    content: str

class StoryCreate(BaseModel):
    title: str
    content: str
    location: str
    images: List[str] = []

@router.get("/posts")
async def get_posts(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
        
    posts = await CommunityPost.find(query).sort(-CommunityPost.createdAt).to_list()
    # Basic mapping
    docs = []
    for p in posts:
        d = p.model_dump()
        d["_id"] = str(d.pop("id"))
        docs.append(d)
    return {"success": True, "data": docs}

@router.post("/posts")
async def create_post(body: PostCreate, user: User = Depends(get_current_user)):
    post = CommunityPost(
        userId=str(user.id),
        clerkUserId=user.clerkUserId,
        **body.model_dump()
    )
    await post.insert()
    d = post.model_dump()
    d["_id"] = str(d.pop("id"))
    return {"success": True, "data": d}

@router.get("/posts/{id}")
async def get_post_by_id(id: str = Path(...)):
    post = await CommunityPost.get(id)
    if not post:
        raise HTTPException(404, "Not found")
    
    comments = await CommunityComment.find(CommunityComment.postId == id).sort(CommunityComment.createdAt).to_list()
    
    d = post.model_dump()
    d["_id"] = str(d.pop("id"))
    
    c_docs = []
    for c in comments:
        cd = c.model_dump()
        cd["_id"] = str(cd.pop("id"))
        c_docs.append(cd)
        
    return {"success": True, "data": {"post": d, "comments": c_docs}}

@router.post("/like")
async def toggle_like(type: str = Query(...), id: str = Query(...), user: User = Depends(get_current_user)):
    if type == "post":
        doc = await CommunityPost.get(id)
    else:
        doc = await CommunityComment.get(id)
        
    if not doc: raise HTTPException(404, "Not found")
    
    if user.clerkUserId in doc.likes:
        doc.likes.remove(user.clerkUserId)
    else:
        doc.likes.append(user.clerkUserId)
        
    await doc.save()
    return {"success": True, "data": doc.likes}

@router.post("/comments")
async def add_comment(body: CommentCreate, user: User = Depends(get_current_user)):
    post = await CommunityPost.get(body.postId)
    if not post: raise HTTPException(404, "Post not found")
    
    comment = CommunityComment(
        postId=body.postId,
        userId=str(user.id),
        clerkUserId=user.clerkUserId,
        content=body.content
    )
    await comment.insert()
    
    post.repliesCount += 1
    await post.save()
    
    d = comment.model_dump()
    d["_id"] = str(d.pop("id"))
    return {"success": True, "data": d}

@router.get("/events")
async def get_events():
    events = await CommunityEvent.find(CommunityEvent.date >= datetime.utcnow()).sort(CommunityEvent.date).to_list()
    docs = []
    for e in events:
        d = e.model_dump()
        d["_id"] = str(d.pop("id"))
        docs.append(d)
    return {"success": True, "data": docs}
    
@router.get("/stories")
async def get_stories():
    stories = await TravelStory.find().sort(-TravelStory.createdAt).to_list()
    docs = []
    for s in stories:
        d = s.model_dump()
        d["_id"] = str(d.pop("id"))
        d["userId"] = str(d["userId"])
        docs.append(d)
    return {"success": True, "data": docs}

@router.post("/stories")
async def create_story(body: StoryCreate, user: User = Depends(get_current_user)):
    story = TravelStory(
        userId=user.id,
        clerkUserId=user.clerkUserId,
        **body.model_dump()
    )
    await story.insert()
    d = story.model_dump()
    d["_id"] = str(d.pop("id"))
    d["userId"] = str(d["userId"])
    return {"success": True, "data": d}

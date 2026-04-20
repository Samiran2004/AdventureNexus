from beanie import Document, PydanticObjectId, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime

class CommunityPost(Document):
    userId: Indexed(str)
    clerkUserId: Indexed(str)
    title: str
    content: str
    category: Indexed(str)
    tags: List[str] = []
    likes: List[str] = [] # clerkUserIds
    repliesCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "community_posts"

class CommunityComment(Document):
    postId: Indexed(str)
    userId: Indexed(str)
    clerkUserId: Indexed(str)
    content: str
    likes: List[str] = [] # clerkUserIds
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "community_comments"

class CommunityEvent(Document):
    title: str
    description: str
    date: datetime
    type: str = "Webinar"  # Webinar or In-Person
    location: Optional[str] = None
    attendees: List[str] = []  # clerkUserIds
    imageUrl: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "community_events"

class TravelStory(Document):
    userId: PydanticObjectId
    clerkUserId: Indexed(str)
    title: str
    content: str
    location: str
    images: List[str] = []
    likes: List[str] = [] # Clerk User IDs
    commentsCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "travel_stories"

class CommunitySpotlight(Document):
    clerkUserId: Indexed(str)
    reason: str
    activeUntil: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "community_spotlights"

class Notification(Document):
    recipientClerkId: Indexed(str)
    senderClerkId: Optional[str] = None
    type: str  # e.g., 'like', 'comment', 'follow', 'system'
    actionUrl: Optional[str] = None
    message: str
    isRead: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"

class DirectMessage(Document):
    senderClerkId: Indexed(str)
    receiverClerkId: Indexed(str)
    content: str
    isRead: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "messages"

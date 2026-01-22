from beanie import Document, Link
from typing import List
from .user_model import User
from .recommendation_model import Recommendations

class RecommendationsHistory(Document):
    userId: Link[User]
    recommendationhistory: List[Link[Recommendations]] = []

    class Settings:
        name = "recommendationshistories" # Check pluralization default in mongoose vs beanie.
        # usually mongoose lowercases and pluralizes. 'RecommendationHistory' -> 'recommendationhistories'

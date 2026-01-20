
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from .config import config
from .database import db

class Recommender:
    def __init__(self):
        self.tfidf = None
        self.plan_embeddings = None
        self.plans_df = None
        self.load_artifacts()

    def load_artifacts(self):
        """Load the pre-trained models and data."""
        try:
            self.tfidf = joblib.load(config.TFIDF_MODEL_FILE)
            self.plan_embeddings = joblib.load(config.PLAN_EMBEDDINGS_FILE)
            self.plans_df = joblib.load(config.PLANS_DF_FILE)
            print("Model artifacts loaded successfully.")
        except FileNotFoundError:
            print("Model artifacts not found. Please run train.py first.")

    def recommend(self, user_id, top_n=5):
        """
        Generate recommendations for a user.
        Strategy: Content-Based Filtering
        1. Build User Profile: combine user preferences + text from their past plans.
        2. Vectorize User Profile.
        3. Compute Cosine Similarity with all Plan Embeddings.
        4. Return top N plans.
        """
        if self.tfidf is None:
            return {"error": "Model not loaded", "status": 500}

        # 1. Fetch User Data
        user = db.get_user_by_id(user_id)
        if not user:
            return {"error": "User not found", "status": 404}

        # 2. Build User Profile Text
        user_text_features = []

        # - Explicit Preferences
        if 'preferences' in user and user['preferences']:
            user_text_features.append(" ".join(user['preferences']))
        
        # - Past History (Plans created by user)
        # Note: In a real scenario we'd query separate logs or history tables.
        # For now, we look at plans they created to see what they like.
        if 'plans' in user and user['plans']:
            # Plans field in userModel is array of ObjectIds
            # We can use our local dataframe if it's up to date, but safer to query DB or use cached df
            # Let's use the cached self.plans_df for speed
            user_plan_ids = [str(pid) for pid in user['plans']]
            user_past_plans = self.plans_df[self.plans_df['_id'].isin(user_plan_ids)]
            
            if not user_past_plans.empty:
                # Aggregate text from past plans
                past_content = (
                    user_past_plans['to'] + " " + 
                    user_past_plans['activities'] + " " +
                    user_past_plans['travel_style']
                )
                user_text_features.extend(past_content.tolist())

        # If we have 0 info, return popular (or random) items
        # For now, if empty, we might just recommend random or top rated.
        # Let's handle the "Cold Start" by checking if query_text is empty.
        query_text = " ".join(user_text_features)
        
        if not query_text.strip():
            # Fallback: Just return a random sample or trending
            return self._get_fallback_recommendations(top_n)

        # 3. Vectorize User Profile
        user_vector = self.tfidf.transform([query_text])

        # 4. Compute Similarity
        # cosine_similarity returns shape (1, n_plans)
        cosine_sim = cosine_similarity(user_vector, self.plan_embeddings).flatten()

        # 5. Get Top N Indices
        # argsort returns indices that sort the array in ascending order, so we take last N and reverse
        top_indices = cosine_sim.argsort()[-top_n:][::-1]

        # 6. Format Output
        recommendations = []
        for idx in top_indices:
            score = cosine_sim[idx]
            plan = self.plans_df.iloc[idx]
            recommendations.append({
                "plan_id": plan['_id'],
                "destination": plan['to'],
                "name": plan.get('name', ''),
                "score": float(score) # convert numpy float to native python float
            })

        return {"status": 200, "user_id": user_id, "recommendations": recommendations}

    def _get_fallback_recommendations(self, n):
        # Simply return first n plans or random n plans
        # Ideally picking highest rated ones
        sample = self.plans_df.head(n)
        recommendations = []
        for _, plan in sample.iterrows():
            recommendations.append({
                "plan_id": plan['_id'],
                "destination": plan['to'],
                "name": plan.get('name', ''),
                "score": 0.0,
                "note": "Fallback recommendation (insufficient user data)"
            })
        return {"status": 200, "recommendations": recommendations}

recommender = Recommender()

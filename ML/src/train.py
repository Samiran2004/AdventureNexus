
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from .database import db
from .config import config
import os

def fetch_plans_data():
    """
    Fetch all plans from MongoDB and convert to DataFrame
    """
    plans_collection = db.get_plans_collection()
    cursor = plans_collection.find({}, {
        "userId": 1, "to": 1, "activities": 1, "travel_style": 1, 
        "destination_overview": 1, "name": 1, "trip_highlights": 1
    })
    
    plans = list(cursor)
    if not plans:
        print("No plans found in database.")
        return pd.DataFrame()
    
    df = pd.DataFrame(plans)
    
    # Ensure all expected columns exist
    expected_cols = ["userId", "to", "activities", "travel_style", "destination_overview", "name", "trip_highlights", "_id"]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = None

    # Convert ObjectId to string for JSON serialization later if needed
    df['_id'] = df['_id'].astype(str)
    return df

def preprocess_data(df):
    """
    Combine relevant text features into a single 'combined_features' column
    """
    # Fill NaN values
    df['activities'] = df['activities'].apply(lambda x: ' '.join([str(i) for i in x]) if isinstance(x, list) else '')
    df['trip_highlights'] = df['trip_highlights'].apply(lambda x: ' '.join([str(i) for i in x]) if isinstance(x, list) else '')
    df['travel_style'] = df['travel_style'].fillna('')
    df['destination_overview'] = df['destination_overview'].fillna('')
    df['name'] = df['name'].fillna('')
    df['to'] = df['to'].fillna('') # Destination name

    # Combine features
    # Weighting: destination and activities are arguably most important
    df['combined_features'] = (
        df['to'] + " " + 
        df['name'] + " " +
        df['activities'] + " " + 
        df['travel_style'] + " " + 
        df['destination_overview'] + " " + 
        df['trip_highlights']
    )
    return df

def train_model():
    print("Fetching data from MongoDB...")
    df = fetch_plans_data()
    
    if df.empty:
        print("Skipping training: plans dataframe is empty.")
        return

    print(f"Fetched {len(df)} plans.")
    
    print("Preprocessing data...")
    df = preprocess_data(df)
    
    print("Training TF-IDF Vectorizer...")
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])
    
    print("Saving model artifacts...")
    # Save the vectorizer
    joblib.dump(tfidf, config.TFIDF_MODEL_FILE)
    
    # Save the plan embeddings (sparse matrix)
    joblib.dump(tfidf_matrix, config.PLAN_EMBEDDINGS_FILE)
    
    # Save the plans dataframe (for retrieving metadata during recommendation)
    # storing only necessary columns to save space
    cols_to_keep = ['_id', 'to', 'name', 'activities', 'travel_style', 'destination_overview']
    joblib.dump(df[cols_to_keep], config.PLANS_DF_FILE)
    
    print(f"Training complete. Artifacts saved to {config.MODEL_PATH}")


if __name__ == "__main__":
    with open("train_debug.log", "w") as f:
        try:
            f.write("Starting training script...\n")
            train_model()
            f.write("Training script finished successfully.\n")
        except Exception as e:
            import traceback
            f.write(f"Training failed: {e}\n")
            f.write(traceback.format_exc())

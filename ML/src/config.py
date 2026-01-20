
import os
from dotenv import load_dotenv


# Resolve paths relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ENV_PATH = os.path.join(BASE_DIR, "../../Backend/.env")
load_dotenv(BACKEND_ENV_PATH)
load_dotenv() # Then load local .env if it exists

class Config:
    MONGO_URI = os.getenv("DB_URI", "mongodb://localhost:27017/API-Powered-Interactive-Travel-Planner")
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models")
    TFIDF_MODEL_FILE = os.path.join(MODEL_PATH, "tfidf_vectorizer.joblib")
    PLAN_EMBEDDINGS_FILE = os.path.join(MODEL_PATH, "plan_embeddings.joblib")
    PLANS_DF_FILE = os.path.join(MODEL_PATH, "plans_df.joblib")

    # Ensure model directory exists
    os.makedirs(MODEL_PATH, exist_ok=True)

config = Config()

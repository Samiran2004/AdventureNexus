
from fastapi import FastAPI, HTTPException
from .recommender import recommender
from .train import train_model
import threading

app = FastAPI(title="AdventureNexus ML Service", version="1.0")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AdventureNexus ML"}

@app.get("/recommend/{user_id}")
def get_recommendations(user_id: str, limit: int = 5):
    """
    Get travel plan recommendations for a specific user.
    """
    result = recommender.recommend(user_id, top_n=limit)
    
    if result.get("status") == 404:
        raise HTTPException(status_code=404, detail=result.get("error"))
    elif result.get("status") == 500:
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return result

@app.post("/retrain")
def trigger_retrain():
    """
    Trigger a model retrain in the background.
    """
    def run_training():
        train_model()
        recommender.load_artifacts() # Reload after training
    
    thread = threading.Thread(target=run_training)
    thread.start()
    
    return {"status": "Training started in background"}

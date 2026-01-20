
# AdventureNexus ML Service

This directory contains the Recommendation Microservice for AdventureNexus.
It uses **Content-Based Filtering** (TF-IDF + Cosine Similarity) to recommend travel plans to users.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configuration**
   The service reads the MongoDB URI from `../Backend/.env` automatically.
   Ensure `DB_URI` is set in the backend env file.

## Usage

### 1. Training (Offline)
Before running the API, you must train the model (generate index artifacts).
```bash
python3 -m src.train
```
This saves artifacts to `models/`.

### 2. Run API
Start the FastAPI server.
```bash
uvicorn src.main:app --reload --port 8001
```
(Note: Port 8001 to avoid conflict with Backend if it runs on 8000. Default uvicorn is 8000).

### 3. API Endpoints
- **GET /recommend/{user_id}**
  - Returns top N recommended plans for the user.
- **POST /retrain**
  - Triggers model retraining in background.

## Directory Structure
- `src/`: Source code
  - `config.py`: Configuration
  - `database.py`: DB Connection
  - `train.py`: Training script
  - `recommender.py`: Inference logic
  - `main.py`: FastAPI app
- `models/`: Generated artifacts (ignored by git usually, but essential for runtime).

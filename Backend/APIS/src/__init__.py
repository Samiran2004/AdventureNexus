from fastapi import FastAPI

app = FastAPI(
    title="AdventureNexus",
    description="REST API for AdventureNexus AI SaaS"
)

@app.get('/health')
def get_health():
    return {
        "status": 200,
        "message": "Server is up and running..."
    }

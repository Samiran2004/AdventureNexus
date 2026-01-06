from fastapi import APIRouter, Request, Response
from app.controllers.clerk_webhook_controller import clerk_webhook

router = APIRouter()

# Path: /api/clerk
# Backend: app.use('/api/clerk', cleckWebhook); 
# But Clerk sends post request. The controller handles logic.
# In backend, it's a middleware/handler.
@router.post("")
async def webhook(request: Request):
    return await clerk_webhook(request)

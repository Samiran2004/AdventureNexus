from fastapi import APIRouter, Response, Request
from app.modules.newsletter.controllers.subscribe_daily_mail_controller import subscribe_daily_mail_controller, SubscribeRequest

router = APIRouter()

# Path: /api/v1/mail
# Backend route: app.post('/api/v1/mail/subscribe', subscribeDailyMailController);
# So path is /subscribe relative to /api/v1/mail
@router.post("/subscribe")
async def subscribe(request: Request, body: SubscribeRequest, response: Response):
    return await subscribe_daily_mail_controller(request, body, response)

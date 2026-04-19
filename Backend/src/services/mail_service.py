from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings
import logging

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_ADDRESS,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_ADDRESS,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_mail(to: str, subject: str, html: str) -> bool:
    """
    Send an email asynchronously using fastapi-mail.
    """
    message = MessageSchema(
        subject=subject,
        recipients=[to],
        body=html,
        subtype="html"
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        return False

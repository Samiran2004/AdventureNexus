import aiosmtplib
from email.message import EmailMessage
from app.core.config.config import config

async def send_mail(to: str, subject: str, html: str):
    message = EmailMessage()
    message["From"] = config.MAIL_ADDRESS
    message["To"] = to
    message["Subject"] = subject
    message.set_content(html, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=config.MAIL_ADDRESS,
            password=config.MAIL_PASSWORD
        )
        return {"status": "success", "response": "Mail sent successfully"}
    except Exception as e:
        print(f"Error sending mail: {e}")
        # Build callbacks or raise error depending on usage
        return {"status": "error", "message": str(e)}

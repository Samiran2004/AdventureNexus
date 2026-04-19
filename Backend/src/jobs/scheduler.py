import logging
import json
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from src.database.models.newsletter import SubscribeMail
from src.services.groq_service import groq_generated_data
from src.services.mail_service import send_mail

logger = logging.getLogger(__name__)

def generate_daily_tips_prompt():
    return """
    Generate a simple, unique, and actionable daily travel tip.
    Format your response AS STRICT JSON:
    {
      "tip_title": "String",
      "tip_content": "String",
      "category": "String"
    }
    No markdown backticks, only JSON string.
    """

async def send_auto_daily_tips_job():
    logger.info("Running daily tips cron job...")
    success_count = 0
    failure_count = 0
    
    try:
        subscribers = await SubscribeMail.find_all().to_list()
        if not subscribers:
            logger.warning("No subscribers found.")
            return
            
        raw_ai = await groq_generated_data(generate_daily_tips_prompt())
        start = raw_ai.find('{')
        end = raw_ai.rfind('}')
        if start == -1 or end == -1:
            logger.error("Failed to generate content from AI or invalid JSON bounds.")
            return
            
        clean_str = raw_ai[start:end+1]
        tip_data = json.loads(clean_str)
        
        # We can handle sending emails concurrently using asyncio.gather to massively speed up processing
        async def send_to_user(user_mail: SubscribeMail):
            nonlocal success_count, failure_count
            try:
                await send_mail(
                    to=user_mail.mail,
                    subject=f"Daily Travel Tip: {tip_data.get('tip_title', 'Travel Tip')}",
                    html=f"""<h2>{tip_data.get('tip_title', 'Daily Travel Tip')}</h2>
                    <p>{tip_data.get('tip_content', 'Enjoy your travels!')}</p>
                    <small>Category: {tip_data.get('category', 'General')}</small>"""
                )
                logger.info(f"Email sent to: {user_mail.mail}")
                success_count += 1
            except Exception as e:
                logger.error(f"Mail sending failed for user {user_mail.mail}: {e}")
                failure_count += 1

        tasks = [send_to_user(sub) for sub in subscribers]
        await asyncio.gather(*tasks, return_exceptions=True)
        
        logger.info(f"Daily tips job finished. Success: {success_count}, Failed: {failure_count}")

    except Exception as e:
        logger.error(f"Error in sending daily tips mail: {e}")

async def simple_runner_job():
    # Only useful for debugging if cron is alive
    logger.info("Runner is running...")

def setup_jobs():
    scheduler = AsyncIOScheduler()
    
    # Run every day at 6:00 AM Kolkata time
    scheduler.add_job(
        send_auto_daily_tips_job,
        'cron',
        hour=6,
        minute=0,
        timezone='Asia/Kolkata',
        id='daily_tips'
    )
    
    # Run every 10 seconds (commented out unless debugging, like node logic, node kept it active)
    # scheduler.add_job(simple_runner_job, 'interval', seconds=10, id='runner_job')
    
    scheduler.start()
    logger.info("APScheduler jobs registered and started.")
    return scheduler

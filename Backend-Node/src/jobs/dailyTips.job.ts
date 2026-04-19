import cron from 'node-cron';
import SubscribeMail from '../shared/database/models/subscribeMail.model';
import emailTemplates from '../shared/utils/email-templates';
import sendMail from '../shared/services/mailService';
import { groqGeneratedData } from '../shared/services/groq.service';
import { generateDailyTips } from '../shared/utils/gemini/generateDailyTips.prompt';
import logger from '../shared/utils/logger';

/**
 * Cron Job to send Daily Travel Tips to subscribers.
 * Scheduled to run every day at 6:00 AM (Asia/Kolkata).
 * 1. Fetches all subscribers.
 * 2. Generates a fresh travel tip using AI (Groq).
 * 3. Sends the tip via email to each subscriber.
 */
const sendAutoDailyTipsJob = async () => {
    let successCount = 0;
    let failureCount = 0;

    try {
        logger.info('Running daily tips cron job...');

        // 1. Fetch all subscribed users from database
        const userMails = await SubscribeMail.find();

        if (userMails.length === 0) {
            logger.warn("No subscribers found.");
            return { status: 'success', message: 'No subscribers to send to.' };
        }

        // 2. Generate daily travel tip content using AI
        const prompt = generateDailyTips();
        const generateDailyTipsContent = await groqGeneratedData(prompt);

        if (!generateDailyTipsContent) {
            logger.error("Failed to generate content from AI.");
            return { status: 'failed', message: 'AI generation failed' };
        }

        // 3. Clean and Parse AI Response
        let tipDataObject;
        try {
            const startIndex = generateDailyTipsContent.indexOf('{');
            const endIndex = generateDailyTipsContent.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) {
                throw new Error("Invalid JSON format from AI");
            }
            const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);
            tipDataObject = JSON.parse(cleanString);
        } catch (parseError) {
            logger.error(`Error parsing AI response: ${generateDailyTipsContent}`);
            return { status: 'failed', message: 'JSON handling error from AI response' };
        }

        // 4. Iterate over each subscriber and send email
        const emailPromises = userMails.map(async (userMail) => {
            try {
                let mailData = emailTemplates.sendDailyTipEmailData(userMail.mail, tipDataObject);
                await new Promise<void>((resolve, reject) => {
                    sendMail(mailData, (mailError) => {
                        if (mailError) {
                            logger.error(`Mail sending failed for user ${userMail.mail}: ${mailError}`);
                            reject(mailError);
                        } else {
                            resolve();
                        }
                    });
                });
                logger.info(`Email sent to: ${userMail.mail}`);
                successCount++;
            } catch (err) {
                failureCount++;
            }
        });

        await Promise.allSettled(emailPromises);

        logger.info(`Daily tips job finished. Success: ${successCount}, Failed: ${failureCount}`);
        return { status: 'success', sent: successCount, failed: failureCount };

    } catch (error) {
        logger.error(`Error in sending daily tips mail: ${error instanceof Error ? error.message : error}`);
        return { status: 'error', message: error instanceof Error ? error.message : "Unknown error" };
    }
}

cron.schedule("0 6 * * *", sendAutoDailyTipsJob, { timezone: "Asia/Kolkata" });

export default sendAutoDailyTipsJob;
import cron from 'node-cron';
import SubscribeMail from '../database/models/subscribeMail.model';
import chalk from 'chalk';
import emailTemplates from '../utils/email-templates';
import sendMail from '../services/mailService';
import generateRecommendation from '../utils/gemini/generateRecommendation';
import { generateDailyTips } from '../utils/gemini/generateDailyTips.prompt';

/**
 * Cron Job to send Daily Travel Tips to subscribers.
 * Scheduled to run every day at 6:00 AM (Asia/Kolkata).
 * 1. Fetches all subscribers.
 * 2. Generates a fresh travel tip using AI (Groq/Gemini).
 * 3. Sends the tip via email to each subscriber.
 */
const sendAutoDailyTipsJob = async () => {
    try {
        console.log(chalk.green('Running daily tips cron job at 6 AM...'));

        // 1. Fetch all subscribed users from database
        const userMails = await SubscribeMail.find();

        // 2. Generate daily travel tip content using AI
        const prompt = generateDailyTips();
        const generateDailyTipsContent = await generateRecommendation(prompt);

        // 3. Clean and Parse AI Response
        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);

        const tipDataObject = JSON.parse(cleanString);

        // 4. Iterate over each subscriber and send email
        for (const userMail of userMails) {
            console.log(userMail.mail);
            let mailData = emailTemplates.sendDailyTipEmailData(userMail.mail, tipDataObject);

            await sendMail(mailData, (mailError: Error | null) => {
                // Warning: 'res' is not defined in this scope! This will crash if error occurs.
                // Refactor: Just log the error, don't try to send response.
                if (mailError) console.error("Mail sending failed for user:", userMail.mail);

                // return res.status(StatusCodes.EXPECTATION_FAILED).json({
                //     status: 'Failed',
                //     message: "Mail sending error!"
                // });
            });

            console.log("Done...");
        }

        console.log(chalk.green("Done sending daily tips subscribe mail job..."));
    } catch (error) {
        console.log(chalk.red(`Error in sending daily tips mail: ${error.message}`));
    }
}

cron.schedule("0 6 * * *", sendAutoDailyTipsJob, { timezone: "Asia/Kolkata" });

export default sendAutoDailyTipsJob;
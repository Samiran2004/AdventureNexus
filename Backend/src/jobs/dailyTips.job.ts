import cron from 'node-cron';
import SubscribeMail from '../Database/models/subscribeMail.model';
import chalk from 'chalk';
import emailTemplates from '../utils/emailTemplate';
import sendMail from '../service/mailService';
import generateRecommendation from '../utils/Gemini Utils/generateRecommendation';
import { generateDailyTips } from '../utils/Gemini Utils/generateDailyTips.prompt';

const sendAutoDailyTipsJob = async () => {
    try {
        console.log(chalk.green('Running daily tips cron job at 6 AM...'));

        // Fetch mails from subscribe database...
        const userMails = await SubscribeMail.find();

        // Generate first travel tips...
        const prompt = generateDailyTips();
        const generateDailyTipsContent = await generateRecommendation(prompt);

        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);

        const tipDataObject = JSON.parse(cleanString);

        for (const userMail of userMails) {
            console.log(userMail.mail);
            let mailData = emailTemplates.sendDailyTipEmailData(userMail.mail, tipDataObject);

            await sendMail(mailData, (mailError: Error | null) => {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            });

            console.log("Done...");
        }

        console.log(chalk.green("Done sending daily tips subscribe mail job..."));
    } catch (error) {
        console.log(chalk.red(`Error in sending daily tips mail: ${error.message}`));
    }
}

cron.schedule("0 6 * * *", sendAutoDailyTipsJob, {timezone: "Asia/Kolkata"});

export default sendAutoDailyTipsJob;
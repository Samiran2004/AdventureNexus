import { getReasonPhrase, StatusCodes } from "http-status-codes"
import SubscribeMail from "../../database/models/subscribeMail.model";
import emailTemplates from "../../utils/email-templates";
import sendMail from "../../services/mailService";
import { generateDailyTips } from "../../utils/gemini/generateDailyTips.prompt";

import { groqGeneratedData } from "../../services/groq.service";
import logger from "../../utils/logger";
import getFullURL from "../../services/getFullURL.service";

/**
 * Controller to handle Daily Mail Subscriptions.
 * Verifies email, creates subscription, sends welcome mail, generates first tip, and sends it.
 */
const subscribeDailyMailController = async (req, res) => {
    const fullUrl: string = getFullURL(req);
    try {
        const { userMail } = req.body;

        // 1. Verify Request: Ensure email is provided
        if (!userMail) {
            logger.error(`URL: ${fullUrl} - User mail is not provided.`);
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Required fields not exist!"
            });
        }

        // 2. Check for Existing Subscription
        const existMail = await SubscribeMail.findOne({ mail: userMail });

        if (existMail) {
            logger.info(`URL: ${fullUrl} - Already subscribed`);
            return res.status(StatusCodes.OK).json({
                status: 'OK',
                message: "Already subscribed!"
            });
        }

        // 3. Create New Subscription in Database
        // Note: Field name mismatch? 'mail' vs 'userMail' in schema? Assuming 'mail' based on existing code, but schema has 'userMail'.
        // FIXME: Check model schema match.
        const newSubscribeMail = new SubscribeMail({
            mail: userMail
        });

        await newSubscribeMail.save();

        // 4. Send Welcome Email
        let mailData = emailTemplates.subscribeDailyMailEmailData(userMail);

        await sendMail(mailData, (mailError: Error | null) => {
            logger.info(`URL: ${fullUrl}`);
            if (mailError) {
                logger.error(`URL: ${fullUrl} - Failed to send welcome mail. Error: ${mailError.message}`);
                // Note: We don't return here so execution continues to generate tip?
                // Or should we fail?
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });

        // 5. Generate First Daily Tip using AI
        const prompt = generateDailyTips();
        const generateDailyTipsContent = await groqGeneratedData(prompt);

        // 6. Clean AI Response (Extract JSON)
        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);

        const tipDataObject = JSON.parse(cleanString);

        // 7. Send Daily Tip Email
        mailData = emailTemplates.sendDailyTipEmailData(userMail, tipDataObject);

        await sendMail(mailData, (mailError: Error | null) => {
            logger.info(`URL: ${fullUrl}`);
            if (mailError) {
                logger.error(`URL: ${fullUrl} - Failed to send first travel tips mail. Error: ${mailError.message}`);
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });

        // 8. Success Response
        logger.info(`URL: ${fullUrl} - Registered`);
        return res.status(StatusCodes.OK).json({
            status: "Ok",
            message: "Registered!",
        });
    } catch (error) {
        logger.error(`URL: ${fullUrl}, error_message: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default subscribeDailyMailController;
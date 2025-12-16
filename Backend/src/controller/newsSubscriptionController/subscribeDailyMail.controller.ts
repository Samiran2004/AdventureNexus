import chalk from "chalk";
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import mongoose from "mongoose";
import SubscribeMail from "../../Database/models/subscribeMail.model";
import emailTemplates from "../../utils/emailTemplate";
import sendMail from "../../service/mailService";
import { generateDailyTips } from "../../utils/Gemini Utils/generateDailyTips.prompt";
import generateRecommendation from "../../utils/Gemini Utils/generateRecommendation";
import { groqGeneratedData } from "../../service/groq.service";
import winstonLogger from "../../service/winston.service";
import getFullURL from "../../service/getFullURL.service";

const subscribeDailyMailController = async (req, res) => {
    const fullUrl: string = getFullURL(req);
    try {
        const { userMail } = req.body;

        // verify the user mail is exist or not...

        if (!userMail) {
            winstonLogger.error(`URL: ${fullUrl}`);
            winstonLogger.error(`User mail is not provided.`);
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Required fields not exist!"
            });
        }

        // Check the provided mail is exist in the database or not...
        const existMail = await SubscribeMail.findOne({ mail: userMail });

        if (existMail) {
            winstonLogger.info(`URL: ${fullUrl}`);
            return res.status(StatusCodes.OK).json({
                status: 'OK',
                message: "Already subscribed!"
            });
        }

        // If not exist...
        const newSubscribeMail = new SubscribeMail({
            mail: userMail
        });

        await newSubscribeMail.save();

        // Send the mail to the user...
        let mailData = emailTemplates.subscribeDailyMailEmailData(userMail);

        // Send the welcome mail...
        await sendMail(mailData, (mailError: Error | null) => {
            winstonLogger.info(`URL: ${fullUrl}`);
            if (mailError) {
                winstonLogger.error(`URL: ${fullUrl}`);
                winstonLogger.debug(`Failed to send welcome mail, Error: ${mailError.message}`);
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });

        // Generate first travel tips...
        const prompt = generateDailyTips();
        // const generateDailyTipsContent = await generateRecommendation(prompt);
        const generateDailyTipsContent = await groqGeneratedData(prompt);

        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);

        const tipDataObject = JSON.parse(cleanString);

        // console.log(tipDataObject);

        // 3. Pass the OBJECT (not string) to the template
        mailData = emailTemplates.sendDailyTipEmailData(userMail, tipDataObject);

        await sendMail(mailData, (mailError: Error | null) => {
            winstonLogger.info(`URL: ${fullUrl}`);
            if (mailError) {
                winstonLogger.error(`URL: ${fullUrl}`);
                winstonLogger.debug(`Failed to send first travel tips mail, Error: ${mailError.message}`);
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });

        winstonLogger.info(`URL: ${fullUrl}`);
        return res.status(StatusCodes.OK).json({
            status: "Ok",
            message: "Registered!",
        });
    } catch (error) {
        winstonLogger.error(`URL: ${fullUrl}, error_message: ${error.message}`);
        console.log(chalk.bgRed(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default subscribeDailyMailController;
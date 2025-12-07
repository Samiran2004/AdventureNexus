import chalk from "chalk";
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import mongoose from "mongoose";
import SubscribeMail from "../../Database/models/subscribeMail.model";
import emailTemplates from "../../utils/emailTemplate";
import sendMail from "../../service/mailService";
import { generateDailyTips } from "../../utils/Gemini Utils/generateDailyTips.prompt";
import generateRecommendation from "../../utils/Gemini Utils/generateRecommendation";

const subscribeDailyMailController = async (req, res) => {
    try {
        const { userMail } = req.body;

        // verify the user mail is exist or not...

        if (!userMail) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Required fields not exist!"
            });
        }

        // Check the provided mail is exist in the database or not...
        const existMail = await SubscribeMail.findOne({ mail: userMail });

        if (existMail) {
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
            if (mailError) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });

        // Generate first travel tips...
        const prompt = generateDailyTips();
        const generateDailyTipsContent = await generateRecommendation(prompt);

        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);

        const tipDataObject = JSON.parse(cleanString);

        console.log(tipDataObject); // Should now show all fields correctly

        // 3. Pass the OBJECT (not string) to the template
        mailData = emailTemplates.sendDailyTipEmailData(userMail, tipDataObject);

        await sendMail(mailData, (mailError: Error | null) => {
            if (mailError) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        })

        return res.status(StatusCodes.OK).json({
            status: "Ok",
            message: "Registered!",
        });
    } catch (error) {
        console.log(chalk.bgRed(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default subscribeDailyMailController;
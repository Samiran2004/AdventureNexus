"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const subscribeMail_model_1 = __importDefault(require("../shared/database/models/subscribeMail.model"));
const email_templates_1 = __importDefault(require("../shared/utils/email-templates"));
const mailService_1 = __importDefault(require("../shared/services/mailService"));
const groq_service_1 = require("../shared/services/groq.service");
const generateDailyTips_prompt_1 = require("../shared/utils/gemini/generateDailyTips.prompt");
const logger_1 = __importDefault(require("../shared/utils/logger"));
const sendAutoDailyTipsJob = () => __awaiter(void 0, void 0, void 0, function* () {
    let successCount = 0;
    let failureCount = 0;
    try {
        logger_1.default.info('Running daily tips cron job...');
        const userMails = yield subscribeMail_model_1.default.find();
        if (userMails.length === 0) {
            logger_1.default.warn("No subscribers found.");
            return { status: 'success', message: 'No subscribers to send to.' };
        }
        const prompt = (0, generateDailyTips_prompt_1.generateDailyTips)();
        const generateDailyTipsContent = yield (0, groq_service_1.groqGeneratedData)(prompt);
        if (!generateDailyTipsContent) {
            logger_1.default.error("Failed to generate content from AI.");
            return { status: 'failed', message: 'AI generation failed' };
        }
        let tipDataObject;
        try {
            const startIndex = generateDailyTipsContent.indexOf('{');
            const endIndex = generateDailyTipsContent.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) {
                throw new Error("Invalid JSON format from AI");
            }
            const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);
            tipDataObject = JSON.parse(cleanString);
        }
        catch (parseError) {
            logger_1.default.error(`Error parsing AI response: ${generateDailyTipsContent}`);
            return { status: 'failed', message: 'JSON handling error from AI response' };
        }
        const emailPromises = userMails.map((userMail) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let mailData = email_templates_1.default.sendDailyTipEmailData(userMail.mail, tipDataObject);
                yield new Promise((resolve, reject) => {
                    (0, mailService_1.default)(mailData, (mailError) => {
                        if (mailError) {
                            logger_1.default.error(`Mail sending failed for user ${userMail.mail}: ${mailError}`);
                            reject(mailError);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                logger_1.default.info(`Email sent to: ${userMail.mail}`);
                successCount++;
            }
            catch (err) {
                failureCount++;
            }
        }));
        yield Promise.allSettled(emailPromises);
        logger_1.default.info(`Daily tips job finished. Success: ${successCount}, Failed: ${failureCount}`);
        return { status: 'success', sent: successCount, failed: failureCount };
    }
    catch (error) {
        logger_1.default.error(`Error in sending daily tips mail: ${error instanceof Error ? error.message : error}`);
        return { status: 'error', message: error instanceof Error ? error.message : "Unknown error" };
    }
});
node_cron_1.default.schedule("0 6 * * *", sendAutoDailyTipsJob, { timezone: "Asia/Kolkata" });
exports.default = sendAutoDailyTipsJob;

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
const subscribeMail_model_1 = __importDefault(require("../database/models/subscribeMail.model"));
const chalk_1 = __importDefault(require("chalk"));
const email_templates_1 = __importDefault(require("../utils/email-templates"));
const mailService_1 = __importDefault(require("../services/mailService"));
const generateRecommendation_1 = __importDefault(require("../utils/gemini/generateRecommendation"));
const generateDailyTips_prompt_1 = require("../utils/gemini/generateDailyTips.prompt");
const sendAutoDailyTipsJob = () => __awaiter(void 0, void 0, void 0, function* () {
    let successCount = 0;
    let failureCount = 0;
    try {
        console.log(chalk_1.default.green('Running daily tips cron job...'));
        const userMails = yield subscribeMail_model_1.default.find();
        if (userMails.length === 0) {
            console.log(chalk_1.default.yellow("No subscribers found."));
            return { status: 'success', message: 'No subscribers to send to.' };
        }
        const prompt = (0, generateDailyTips_prompt_1.generateDailyTips)();
        const generateDailyTipsContent = yield (0, generateRecommendation_1.default)(prompt);
        if (!generateDailyTipsContent) {
            console.error(chalk_1.default.red("Failed to generate content from AI."));
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
            console.error(chalk_1.default.red("Error parsing AI response:"), generateDailyTipsContent);
            return { status: 'failed', message: 'JSON handling error from AI response' };
        }
        const emailPromises = userMails.map((userMail) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let mailData = email_templates_1.default.sendDailyTipEmailData(userMail.mail, tipDataObject);
                yield new Promise((resolve, reject) => {
                    (0, mailService_1.default)(mailData, (mailError) => {
                        if (mailError) {
                            console.error(`Mail sending failed for user ${userMail.mail}:`, mailError);
                            reject(mailError);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                console.log(`Email sent to: ${userMail.mail}`);
                successCount++;
            }
            catch (err) {
                failureCount++;
            }
        }));
        yield Promise.allSettled(emailPromises);
        console.log(chalk_1.default.green(`Daily tips job finished. Success: ${successCount}, Failed: ${failureCount}`));
        return { status: 'success', sent: successCount, failed: failureCount };
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error in sending daily tips mail: ${error instanceof Error ? error.message : error}`));
        return { status: 'error', message: error instanceof Error ? error.message : "Unknown error" };
    }
});
node_cron_1.default.schedule("0 6 * * *", sendAutoDailyTipsJob, { timezone: "Asia/Kolkata" });
exports.default = sendAutoDailyTipsJob;

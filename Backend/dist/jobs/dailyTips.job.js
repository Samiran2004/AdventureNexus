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
const subscribeMail_model_1 = __importDefault(require("../Database/models/subscribeMail.model"));
const chalk_1 = __importDefault(require("chalk"));
const emailTemplate_1 = __importDefault(require("../utils/emailTemplate"));
const mailService_1 = __importDefault(require("../service/mailService"));
const generateRecommendation_1 = __importDefault(require("../utils/Gemini Utils/generateRecommendation"));
const generateDailyTips_prompt_1 = require("../utils/Gemini Utils/generateDailyTips.prompt");
const sendAutoDailyTipsJob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(chalk_1.default.green('Running daily tips cron job at 6 AM...'));
        const userMails = yield subscribeMail_model_1.default.find();
        const prompt = (0, generateDailyTips_prompt_1.generateDailyTips)();
        const generateDailyTipsContent = yield (0, generateRecommendation_1.default)(prompt);
        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);
        const tipDataObject = JSON.parse(cleanString);
        for (const userMail of userMails) {
            console.log(userMail.mail);
            let mailData = emailTemplate_1.default.sendDailyTipEmailData(userMail.mail, tipDataObject);
            yield (0, mailService_1.default)(mailData, (mailError) => {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            });
            console.log("Done...");
        }
        console.log(chalk_1.default.green("Done sending daily tips subscribe mail job..."));
    }
    catch (error) {
        console.log(chalk_1.default.red(`Error in sending daily tips mail: ${error.message}`));
    }
});
node_cron_1.default.schedule("0 6 * * *", sendAutoDailyTipsJob, { timezone: "Asia/Kolkata" });
exports.default = sendAutoDailyTipsJob;

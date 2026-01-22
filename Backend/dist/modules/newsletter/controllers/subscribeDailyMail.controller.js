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
const http_status_codes_1 = require("http-status-codes");
const subscribeMail_model_1 = __importDefault(require("../../../shared/database/models/subscribeMail.model"));
const email_templates_1 = __importDefault(require("../../../shared/utils/email-templates"));
const mailService_1 = __importDefault(require("../../../shared/services/mailService"));
const generateDailyTips_prompt_1 = require("../../../shared/utils/gemini/generateDailyTips.prompt");
const groq_service_1 = require("../../../shared/services/groq.service");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const getFullURL_service_1 = __importDefault(require("../../../shared/services/getFullURL.service"));
const subscribeDailyMailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullUrl = (0, getFullURL_service_1.default)(req);
    try {
        const { userMail } = req.body;
        if (!userMail) {
            logger_1.default.error(`URL: ${fullUrl} - User mail is not provided.`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Required fields not exist!"
            });
        }
        const existMail = yield subscribeMail_model_1.default.findOne({ mail: userMail });
        if (existMail) {
            logger_1.default.info(`URL: ${fullUrl} - Already subscribed`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'OK',
                message: "Already subscribed!"
            });
        }
        const newSubscribeMail = new subscribeMail_model_1.default({
            mail: userMail
        });
        yield newSubscribeMail.save();
        let mailData = email_templates_1.default.subscribeDailyMailEmailData(userMail);
        yield (0, mailService_1.default)(mailData, (mailError) => {
            logger_1.default.info(`URL: ${fullUrl}`);
            if (mailError) {
                logger_1.default.error(`URL: ${fullUrl} - Failed to send welcome mail. Error: ${mailError.message}`);
                return res.status(http_status_codes_1.StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });
        const prompt = (0, generateDailyTips_prompt_1.generateDailyTips)();
        const generateDailyTipsContent = yield (0, groq_service_1.groqGeneratedData)(prompt);
        const startIndex = generateDailyTipsContent.indexOf('{');
        const endIndex = generateDailyTipsContent.lastIndexOf('}');
        const cleanString = generateDailyTipsContent.substring(startIndex, endIndex + 1);
        const tipDataObject = JSON.parse(cleanString);
        mailData = email_templates_1.default.sendDailyTipEmailData(userMail, tipDataObject);
        yield (0, mailService_1.default)(mailData, (mailError) => {
            logger_1.default.info(`URL: ${fullUrl}`);
            if (mailError) {
                logger_1.default.error(`URL: ${fullUrl} - Failed to send first travel tips mail. Error: ${mailError.message}`);
                return res.status(http_status_codes_1.StatusCodes.EXPECTATION_FAILED).json({
                    status: 'Failed',
                    message: "Mail sending error!"
                });
            }
        });
        logger_1.default.info(`URL: ${fullUrl} - Registered`);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "Ok",
            message: "Registered!",
        });
    }
    catch (error) {
        logger_1.default.error(`URL: ${fullUrl}, error_message: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.default = subscribeDailyMailController;

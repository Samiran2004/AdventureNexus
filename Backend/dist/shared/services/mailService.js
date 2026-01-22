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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const sendMail = (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: config_1.config.MAIL_ADDRESS,
            pass: config_1.config.MAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: config_1.config.MAIL_ADDRESS,
        to: data.to,
        subject: data.subject,
        html: data.html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null);
        }
        else {
            callback(null, info.response);
        }
    });
});
exports.default = sendMail;

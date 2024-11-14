"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const sendMail = async (data, callback) => {
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
};
exports.default = sendMail;

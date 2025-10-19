"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    phoneNumber: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true
    }
});
const Contact = new mongoose_1.default.model('Contact', contactSchema);
module.exports = Contact;

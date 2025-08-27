"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaValidationLogin = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchemaValidationLogin = joi_1.default.object({
    username: joi_1.default.string()
        .min(3)
        .max(30)
        .required()
        .alphanum(),
    email: joi_1.default.string()
        .email()
        .required(),
    password: joi_1.default.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
});

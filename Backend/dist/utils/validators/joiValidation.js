"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userJoiSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(3).max(30).required().messages({
        'string.base': `Full Name should be a type of 'text'`,
        'string.empty': `Full Name cannot be an empty field`,
        'string.min': `Full Name should have a minimum length of {#limit}`,
        'string.max': `Full Name should have a maximum length of {#limit}`,
        'any.required': `Full Name is a required field`,
    }),
    username: joi_1.default.string().alphanum().min(3).max(30).required().messages({
        'string.base': `Username should be a type of 'text'`,
        'string.empty': `Username cannot be an empty field`,
        'string.min': `Username should have a minimum length of {#limit}`,
        'string.max': `Username should have a maximum length of {#limit}`,
        'any.required': `Username is a required field`,
    }),
    email: joi_1.default.string()
        .required(),
});

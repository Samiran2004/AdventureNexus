"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Define the validation schema for user registration
exports.userSchemaValidation = joi_1.default.object({
    username: joi_1.default.string()
        .min(3) // Minimum length for username
        .max(30) // Maximum length for username
        .required() // Username is required
        .alphanum(), // Only alphanumeric characters are allowed
    email: joi_1.default.string()
        .email() // Must be a valid email format
        .required(), // Email is required
    password: joi_1.default.string()
        .min(6) // Minimum length for password
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Allow only alphanumeric characters
        .required() // Password is required
});

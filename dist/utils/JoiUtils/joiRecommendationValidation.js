"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Define the validation schema for travel recommendations
exports.recommendationValidation = joi_1.default.object({
    day: joi_1.default.number()
        .integer() // Ensures the number is an integer
        .positive() // Ensures the number is positive
        .required(), // day is required
    budget: joi_1.default.number()
        .positive() // Ensures the budget is a positive number
        .required(), // budget is required
    destination: joi_1.default.string()
        .min(1) // Ensures at least one character
        .required(), // destination is required
    date: joi_1.default.string()
        .isoDate() // Validates that the string is an ISO 8601 date format (YYYY-MM-DD)
        .required(), // date is required
    totalPeople: joi_1.default.number()
        .integer() // Ensures the number is an integer
        .positive() // Ensures the number is positive
        .required(), // totalPeople is required
});

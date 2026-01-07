"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const recommendationsJoiSchema = joi_1.default.object({
    to: joi_1.default.string().required(),
    from: joi_1.default.string().required(),
    date: joi_1.default.string().required(),
    travelers: joi_1.default.number().required(),
    budget: joi_1.default.number().required(),
    messages: {
        'string.base': `Field should be a type of 'text'`,
        'string.empty': `Field cannot be an empty field`,
        'any.required': `Field is a required field`,
        'number.base': `Field should be a type of 'number'`,
        'number.empty': `Field cannot be an empty field`,
    }
});
exports.default = recommendationsJoiSchema;

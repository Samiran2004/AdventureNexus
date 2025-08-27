"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.recommendationValidation = joi_1.default.object({
    day: joi_1.default.number()
        .integer()
        .positive()
        .required(),
    budget: joi_1.default.number()
        .positive()
        .required(),
    destination: joi_1.default.string()
        .min(1)
        .required(),
    date: joi_1.default.string()
        .isoDate()
        .required(),
    totalPeople: joi_1.default.number()
        .integer()
        .positive()
        .required(),
});

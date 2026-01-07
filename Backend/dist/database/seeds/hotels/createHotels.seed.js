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
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const createHotelsPrompt_1 = require("../../../utils/gemini/createHotelsPrompt");
const generateRecommendation_1 = __importDefault(require("../../../utils/gemini/generateRecommendation"));
const generateHotelsImagePrompt_1 = require("../../../utils/gemini/generateHotelsImagePrompt");
const createHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Create Hotels seed...");
        const { destination, duration, budget, currency_code } = req.body;
        if (!destination || !duration || !budget || !currency_code) {
            console.log(chalk_1.default.red("All fields are required..."));
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.BAD_REQUEST)
            });
        }
        const dataPayload = {
            destination,
            duration,
            budget,
            currency_code
        };
        let prompt = yield (0, createHotelsPrompt_1.generateHotelSearchPrompt)(dataPayload);
        const generatedData = yield (0, generateRecommendation_1.default)(prompt);
        const data = JSON.parse(generatedData.replace(/```json|```/g, '').trim());
        const imagePayload = {
            hotelName: data[0].hotel_name,
            location: data[0].location_description
        };
        prompt = yield (0, generateHotelsImagePrompt_1.generateHotelImage)(imagePayload);
        const hotelImageData = yield (0, generateRecommendation_1.default)(prompt);
        const imageData = JSON.parse(hotelImageData.replace(/```json|```/g, '').trim());
        for (const d of data) {
            d.image = imageData;
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'Ok',
            data: data
        });
    }
    catch (error) {
        console.log(chalk_1.default.red(`Internal Server Error for create hotels...\nError:${error.message}`));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
});
exports.default = createHotels;

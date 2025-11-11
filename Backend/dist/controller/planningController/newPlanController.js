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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlan = void 0;
const http_status_codes_1 = require("http-status-codes");
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { destination, dispatch_city, travel_dates, budget, total_people } = req.body;
        if (!destination || !dispatch_city || !travel_dates || !budget || !total_people) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.BAD_REQUEST)
            });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
});
exports.createPlan = createPlan;

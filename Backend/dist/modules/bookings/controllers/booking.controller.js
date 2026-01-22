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
exports.getMyBookings = exports.createBooking = void 0;
const http_status_codes_1 = require("http-status-codes");
const bookingModel_1 = __importDefault(require("../../../shared/database/models/bookingModel"));
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const getFullURL_service_1 = __importDefault(require("../../../shared/services/getFullURL.service"));
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const fullUrl = (0, getFullURL_service_1.default)(req);
    try {
        const clerkUserId = (_a = req.auth()) === null || _a === void 0 ? void 0 : _a.userId;
        if (!clerkUserId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }
        const { type, referenceId, roomId, totalPrice, travelDates, paxCount, bookingDetails } = req.body;
        if (!type || !referenceId || !totalPrice) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Missing required fields"
            });
        }
        const bookingData = {
            clerkUserId,
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            type,
            referenceId,
            roomId,
            totalPrice,
            travelDates,
            paxCount,
            bookingDetails,
            status: 'Confirmed'
        };
        const newBooking = new bookingModel_1.default(bookingData);
        yield newBooking.save();
        logger_1.default.info(`URL: ${fullUrl} - Booking created: ${newBooking._id}`);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: "Ok",
            message: "Booking confirmed",
            data: newBooking
        });
    }
    catch (error) {
        logger_1.default.error(`URL: ${fullUrl} - Error: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
});
exports.createBooking = createBooking;
const getMyBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fullUrl = (0, getFullURL_service_1.default)(req);
    try {
        const clerkUserId = (_a = req.auth()) === null || _a === void 0 ? void 0 : _a.userId;
        if (!clerkUserId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: "Failed",
                message: "Unauthorized"
            });
        }
        const bookings = yield bookingModel_1.default.find({ clerkUserId })
            .populate('referenceId')
            .populate('roomId');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "Ok",
            data: bookings
        });
    }
    catch (error) {
        logger_1.default.error(`URL: ${fullUrl} - Error: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
});
exports.getMyBookings = getMyBookings;

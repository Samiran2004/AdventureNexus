"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const authClerkTokenMiddleware_1 = __importDefault(require("../../../shared/middleware/authClerkTokenMiddleware"));
const router = express_1.default.Router();
router.post('/', authClerkTokenMiddleware_1.default, booking_controller_1.createBooking);
router.get('/my', authClerkTokenMiddleware_1.default, booking_controller_1.getMyBookings);
exports.default = router;

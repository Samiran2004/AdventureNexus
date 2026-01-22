"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    clerkUserId: { type: String, required: true },
    type: { type: String, enum: ['Flight', 'Hotel'], required: true },
    referenceId: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'type' },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    bookingDetails: { type: mongoose_1.Schema.Types.Mixed },
    travelDates: {
        from: { type: Date },
        to: { type: Date }
    },
    paxCount: { type: Number, default: 1 }
}, { timestamps: true });
const Booking = (0, mongoose_1.model)('Booking', bookingSchema);
exports.default = Booking;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const flightSchema = new mongoose_1.Schema({
    airline: { type: String, required: true },
    flight_number: { type: String, required: true },
    departure_time: { type: String, required: true },
    arrival_time: { type: String, required: true },
    price: { type: String, required: true },
    class: { type: String, enum: ['Economy', 'Business', 'First Class'], default: 'Economy' },
    duration: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure_airport: String,
    arrival_airport: String,
    available_seats: { type: Number, default: 60 }
}, { timestamps: true });
const Flight = (0, mongoose_1.model)('Flight', flightSchema);
exports.default = Flight;

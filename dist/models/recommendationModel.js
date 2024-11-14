"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recommendationSchema = new mongoose_1.Schema({
    destination: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    totalPerson: {
        type: Number,
        default: 1,
    },
    recommendationOn: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
});
const Recommendations = (0, mongoose_1.model)('Recommendations', recommendationSchema);
exports.default = Recommendations;

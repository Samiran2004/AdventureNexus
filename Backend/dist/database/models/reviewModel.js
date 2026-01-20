"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    tripType: {
        type: String,
        enum: ['solo', 'family', 'couple', 'adventure', 'cultural', 'business', 'nature'],
        required: true
    },
    tripDuration: {
        type: String,
        required: true
    },
    travelers: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
            type: String
        }],
    helpfulCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;

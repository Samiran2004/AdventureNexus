"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomType: {
        type: String,
        default: "Standard"
    },
    description: {
        type: String
    },
    pricePerNight: {
        type: Number
    },
    capacity: {
        adults: {
            type: Number,
            default: 1
        },
        children: {
            type: Number,
            default: 0
        }
    },
    amenities: [String],
    bookDates: [
        {
            from: {
                type: String
            },
            to: {
                type: String
            }
        }
    ],
    images: [
        {
            cloudinaryURL: {
                type: String
            },
            cloudinaryPublicId: {
                type: String
            }
        }
    ]
});
const Room = new mongoose_1.default.model('Room', roomSchema);
exports.default = Room;

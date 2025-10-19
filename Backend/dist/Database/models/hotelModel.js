"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const hotelSchema = new mongoose_1.Schema({
    hotel_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Hotel", "Resort", "Apartment", "Villa", "Hostel"]
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    },
    contact: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    images: [
        {
            cloudinaryURL: {
                type: String
            },
            cloudinaryPublicId: {
                type: String
            }
        }
    ],
    amenities: [String],
    checkInTime: {
        type: String,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        default: "11:00"
    },
    rooms: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { timestamps: true });
const Hotel = mongoose_1.default.model('Hotel', hotelSchema);
exports.default = Hotel;

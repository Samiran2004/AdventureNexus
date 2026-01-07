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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender || (Gender = {}));
const userSchema = new mongoose_1.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    profilepicture: { type: String, default: "" },
    phonenumber: {
        type: Number,
        validate: {
            validator: function (v) {
                return v == null || /^\d{10}$/.test(v.toString());
            },
            message: 'Phone number must be exactly 10 digits'
        },
        default: null
    },
    fullname: { type: String, default: "" },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    country: { type: String, default: "" },
    preferences: {
        type: [String],
        default: [],
    },
    plans: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Plan',
        },
    ],
}, {
    timestamps: true,
});
userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern.clerkUserId) {
            next(new Error('User with this Clerk ID already exists'));
        }
        else if (error.keyPattern.username) {
            next(new Error('Username already taken'));
            next(new Error('Phone number already registered'));
        }
        else {
            next(new Error('Duplicate field error'));
        }
    }
    else {
        next(error);
    }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;

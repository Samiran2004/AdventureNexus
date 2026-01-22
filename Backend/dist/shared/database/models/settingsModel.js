"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    value: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });
const Settings = mongoose_1.default.model('Settings', settingsSchema);
exports.default = Settings;

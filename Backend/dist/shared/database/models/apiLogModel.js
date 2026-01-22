"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiLogSchema = new mongoose_1.default.Schema({
    method: String,
    endpoint: String,
    statusCode: Number,
    duration: Number,
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now, index: true }
});
apiLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });
const ApiLog = mongoose_1.default.model('ApiLog', apiLogSchema);
exports.default = ApiLog;

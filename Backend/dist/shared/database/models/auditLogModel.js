"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auditLogSchema = new mongoose_1.default.Schema({
    action: {
        type: String,
        required: true,
        index: true
    },
    module: {
        type: String,
        required: true,
        index: true
    },
    adminId: {
        type: String,
        required: true
    },
    targetId: {
        type: String,
        index: true
    },
    details: {
        type: mongoose_1.default.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    }
}, { timestamps: true });
auditLogSchema.statics.log = function (data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.create(data);
    });
};
const AuditLog = mongoose_1.default.model('AuditLog', auditLogSchema);
exports.default = AuditLog;

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
exports.telemetryMiddleware = void 0;
const apiLogModel_1 = __importDefault(require("../database/models/apiLogModel"));
const logger_1 = __importDefault(require("../utils/logger"));
const telemetryMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const duration = Date.now() - start;
            const logData = {
                method: req.method,
                endpoint: req.originalUrl.split('?')[0],
                statusCode: res.statusCode,
                duration,
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            };
            apiLogModel_1.default.create(logData).catch(err => {
                logger_1.default.error('Failed to create ApiLog entry:', err);
            });
        }
        catch (error) {
            logger_1.default.error('Error in telemetry middleware finish event:', error);
        }
    }));
    next();
};
exports.telemetryMiddleware = telemetryMiddleware;

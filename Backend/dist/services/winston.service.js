"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = 'logs';
const errorLogPath = path_1.default.join(logDir, 'error.log');
const combinedLogPath = path_1.default.join(logDir, 'combined.log');
const winstonLogger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: errorLogPath,
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: combinedLogPath
        }),
    ],
});
exports.default = winstonLogger;

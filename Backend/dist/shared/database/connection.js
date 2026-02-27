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
const logger_1 = __importDefault(require("../utils/logger"));
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
const connection = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, attempt = 1) {
    if (attempt === 1) {
        mongoose_1.default.connection.on('connected', () => {
            logger_1.default.info('Connected to database successfully');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.default.error('Database connection error:', err.message);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.warn('Database disconnected. Attempting to reconnect...');
        });
    }
    try {
        yield mongoose_1.default.connect(url, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 10000,
        });
    }
    catch (error) {
        logger_1.default.error(`Failed to connect to database (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
        if (attempt >= MAX_RETRIES) {
            logger_1.default.error('❌ Could not connect to MongoDB after maximum retries. ' +
                'Server will continue running — please resume your Atlas cluster at https://cloud.mongodb.com');
            return;
        }
        logger_1.default.info(`Retrying database connection in ${RETRY_DELAY_MS / 1000}s...`);
        yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return connection(url, attempt + 1);
    }
});
exports.default = connection;

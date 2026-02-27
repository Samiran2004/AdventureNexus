"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config();
const redis = new ioredis_1.Redis({
    host: config_1.config.REDIS_HOST,
    port: Number(config_1.config.REDIS_PORT),
    password: config_1.config.REDIS_PASSWORD,
    commandTimeout: 2000,
    enableOfflineQueue: false,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 0,
});
redis.on('error', (err) => {
    logger_1.default.warn(`[Redis] Connection Error/Hostname not found: ${err.message}`);
});
redis.on('connect', () => {
    logger_1.default.info('✅ [Redis] Connection established');
});
exports.default = redis;

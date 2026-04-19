import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { config } from '../config/config';
import logger from '../utils/logger';

dotenv.config();

const redis = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    commandTimeout: 2000,
    enableOfflineQueue: false,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 0, // Critical for avoiding "retries exceeded" crashes
});

// Error handling to prevent unhandled rejections
redis.on('error', (err) => {
    logger.warn(`[Redis] Connection Error/Hostname not found: ${err.message}`);
});

redis.on('connect', () => {
    logger.info('✅ [Redis] Connection established');
});

export default redis;

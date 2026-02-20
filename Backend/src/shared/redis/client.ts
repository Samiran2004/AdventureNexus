import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { config } from '../config/config';
import logger from '../utils/logger';

dotenv.config();

const redis = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    commandTimeout: 2000,       // 2 seconds timeout for commands
    enableOfflineQueue: false,  // Don't queue commands when Redis is down
    lazyConnect: true,          // Don't connect immediately on instantiation
    maxRetriesPerRequest: 1,    // Fail fast per request instead of hanging
    retryStrategy: (times: number) => {
        if (times > 5) {
            logger.error(
                '❌ Redis unavailable after 5 retries. Caching disabled. ' +
                'Please resume your Redis instance at https://app.redislabs.com'
            );
            return null; // Stop retrying — don't crash
        }
        const delay = Math.min(times * 1000, 5000); // 1s, 2s, 3s, 4s, 5s
        logger.warn(`Redis retry attempt ${times} in ${delay}ms...`);
        return delay;
    },
});

// Suppress unhandled error events — log them instead
redis.on('error', (err: Error) => {
    logger.warn(`Redis connection error: ${err.message}`);
});

redis.on('connect', () => {
    logger.info('Redis connected successfully');
});

export default redis;

import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { config } from '../config/config';

dotenv.config();

const redis = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    commandTimeout: 2000, // 2 seconds timeout for commands
    enableOfflineQueue: false, // Don't queue commands if Redis is down
});

export default redis;

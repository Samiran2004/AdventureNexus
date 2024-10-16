import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // Ensure the port is a number
    password: process.env.REDIS_PASSWORD
});

export default redis;
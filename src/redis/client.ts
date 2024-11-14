import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { config } from '../config/config';

dotenv.config();

const redis = new Redis({
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT), // Ensure the port is a number
  password: config.REDIS_PASSWORD,
});

export default redis;

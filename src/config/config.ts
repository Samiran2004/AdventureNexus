import dotenv from 'dotenv';
dotenv.config();

const _config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};

export const config = Object.freeze(_config);

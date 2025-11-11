"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    DATABASE_URI: process.env.DB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDINARY_CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUDINARY_CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    UNSPLASH_APPLICATION_ID: process.env.UNSPLASH_APPLICATION_ID,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_KEY: process.env.CLERK_WEBHOOK_KEY
};
exports.config = Object.freeze(_config);

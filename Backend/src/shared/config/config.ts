import dotenv from 'dotenv';
dotenv.config();

// Centralized configuration object for the application
const _config = {
    // Server Port
    port: process.env.PORT,

    // Environment (development/production)
    env: process.env.NODE_ENV,

    // JWT Secrets for authentication
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    // Redis Configuration
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    // Email Service Credentials
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,

    // MongoDB Connection URI
    DATABASE_URI: process.env.DB_URI,

    // Cloudinary Credentials (Image Uploads)
    CLOUDINARY_CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDINARY_CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUDINARY_CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,

    // External API Keys (AI, Information)
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    UNSPLASH_APPLICATION_ID: process.env.UNSPLASH_APPLICATION_ID,

    // Clerk Authentication Keys
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_KEY: process.env.CLERK_WEBHOOK_KEY
};

// Freeze configuration to prevent runtime modifications
export const config = Object.freeze(_config);


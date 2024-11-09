import dotenv from "dotenv";
dotenv.config();

const _config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
}

export const config = Object.freeze(_config);
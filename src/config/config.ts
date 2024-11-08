import dotenv from "dotenv";
dotenv.config();

const _config = {
    env: process.env.NODE_ENV
}

export const config = Object.freeze(_config);
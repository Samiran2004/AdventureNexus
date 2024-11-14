"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
dotenv_1.default.config();
const redis = new ioredis_1.Redis({
    host: config_1.config.REDIS_HOST,
    port: Number(config_1.config.REDIS_PORT), // Ensure the port is a number
    password: config_1.config.REDIS_PASSWORD,
});
exports.default = redis;

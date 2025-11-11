"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: config_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.config.CLOUDINARY_CLOUD_API_KEY,
    api_secret: config_1.config.CLOUDINARY_CLOUD_API_SECRET,
});
exports.default = cloudinary_1.v2;

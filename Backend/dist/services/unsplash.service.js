"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUnsplashImage = void 0;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
dotenv_1.default.config();
const fetchUnsplashImage = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const accessKey = config_1.config.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;
        if (!accessKey) {
            console.error(chalk_1.default.red("Unsplash API Key is missing! Please set UNSPLASH_ACCESS_KEY in .env"));
            return undefined;
        }
        const endpoint = `https://api.unsplash.com/search/photos`;
        const params = {
            query: query,
            per_page: 1,
            orientation: 'landscape',
            client_id: accessKey
        };
        const response = yield axios_1.default.get(endpoint, { params });
        const results = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results;
        if (!results || results.length === 0) {
            console.log(chalk_1.default.yellow(`No image found on Unsplash for ${query}`));
            return undefined;
        }
        const imageUrl = (_b = results[0].urls) === null || _b === void 0 ? void 0 : _b.regular;
        if (imageUrl) {
            console.log(chalk_1.default.green(`Image fetched from Unsplash for ${query}`));
            return imageUrl;
        }
        else {
            return undefined;
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error fetching Unsplash image for ${query}:`, error instanceof Error ? error.message : error));
        return undefined;
    }
});
exports.fetchUnsplashImage = fetchUnsplashImage;

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
exports.fetchWikipediaImage = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
const fetchWikipediaImage = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const endpoint = `https://en.wikipedia.org/w/api.php`;
        const params = {
            action: 'query',
            generator: 'search',
            gsrsearch: query,
            gsrlimit: 1,
            prop: 'pageimages',
            format: 'json',
            pithumbsize: 1000,
            origin: '*'
        };
        const response = yield axios_1.default.get(endpoint, {
            params,
            headers: {
                'User-Agent': 'AdventureNexus/1.0 (https://adventure-nexus.com; contact@adventure-nexus.com)'
            }
        });
        const pages = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.pages;
        if (!pages)
            return undefined;
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1')
            return undefined;
        const page = pages[pageId];
        const imageUrl = (_c = page.thumbnail) === null || _c === void 0 ? void 0 : _c.source;
        if (imageUrl) {
            logger_1.default.info(`Image fetched from Wikipedia for ${query}`);
            return imageUrl;
        }
        else {
            logger_1.default.warn(`No image found on Wikipedia for ${query}`);
            return undefined;
        }
    }
    catch (error) {
        logger_1.default.error(`Error fetching Wikipedia image for ${query}:`, error instanceof Error ? error.message : error);
        return undefined;
    }
});
exports.fetchWikipediaImage = fetchWikipediaImage;

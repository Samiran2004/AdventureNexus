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
const http_status_codes_1 = require("http-status-codes");
const unsplash_service_1 = require("../../../shared/services/unsplash.service");
const logger_1 = __importDefault(require("../../../shared/utils/logger"));
const cacheService_1 = require("../../../shared/utils/cacheService");
const getDestinationImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, count } = req.body;
        if (!query) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Query parameter is required",
            });
        }
        const prefix = cacheService_1.CACHE_CONFIG.PREFIX.IMAGES;
        const identifier = `${query}:${count || 12}`;
        const cachedImages = yield cacheService_1.cacheService.get(prefix, identifier);
        if (cachedImages) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: "Ok",
                data: cachedImages,
            });
        }
        const images = yield (0, unsplash_service_1.fetchUnsplashImages)(query, count || 12);
        yield cacheService_1.cacheService.set(prefix, identifier, images);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "Ok",
            data: images,
        });
    }
    catch (error) {
        logger_1.default.error(`Error fetching destination images: ${error.message}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Internal Server Error",
        });
    }
});
exports.default = getDestinationImages;

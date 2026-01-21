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
exports.cacheMiddleware = void 0;
const cacheService_1 = require("../utils/cacheService");
const logger_1 = __importDefault(require("../utils/logger"));
const cacheMiddleware = (options) => {
    const { ttl, useUserPrefix = false, prefix } = options;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (req.method !== 'GET') {
            return next();
        }
        if (req.headers['x-refresh-cache'] === 'true') {
            return next();
        }
        let identifier = req.path;
        const queryParams = Object.keys(req.query).sort();
        if (queryParams.length > 0) {
            const queryString = queryParams
                .map(key => `${key}=${req.query[key]}`)
                .join('&');
            identifier += `?${queryString}`;
        }
        if (useUserPrefix) {
            const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
            if (userId) {
                identifier = `${userId}:${identifier}`;
            }
        }
        const cachedResponse = yield cacheService_1.cacheService.get(prefix, identifier);
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheService_1.cacheService.set(prefix, identifier, body, ttl).catch(err => logger_1.default.error(`[Cache] Set Error [${prefix}:${identifier}]:`, err));
            }
            return originalJson(body);
        };
        next();
    });
};
exports.cacheMiddleware = cacheMiddleware;

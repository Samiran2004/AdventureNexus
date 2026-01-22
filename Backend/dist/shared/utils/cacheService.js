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
exports.CACHE_CONFIG = exports.cacheService = void 0;
const client_1 = __importDefault(require("../redis/client"));
const logger_1 = __importDefault(require("./logger"));
const cache_config_1 = require("../config/cache.config");
Object.defineProperty(exports, "CACHE_CONFIG", { enumerable: true, get: function () { return cache_config_1.CACHE_CONFIG; } });
class CacheService {
    constructor() {
        this.root = cache_config_1.CACHE_CONFIG.ROOT_PREFIX;
    }
    buildKey(prefix, identifier) {
        return `${this.root}:${prefix}:${identifier}`;
    }
    get(prefix, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.buildKey(prefix, identifier);
            try {
                const data = yield client_1.default.get(key);
                if (!data)
                    return null;
                return JSON.parse(data);
            }
            catch (error) {
                logger_1.default.error(`[CacheService] GET Error [${key}]:`, error);
                return null;
            }
        });
    }
    set(prefix, identifier, value, ttlSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.buildKey(prefix, identifier);
            const ttl = ttlSeconds || cache_config_1.CACHE_CONFIG.TTL[prefix.toUpperCase()] || cache_config_1.CACHE_CONFIG.DEFAULT_TTL;
            try {
                const stringData = JSON.stringify(value);
                yield client_1.default.setex(key, ttl, stringData);
            }
            catch (error) {
                logger_1.default.error(`[CacheService] SET Error [${key}]:`, error);
            }
        });
    }
    del(prefix, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.buildKey(prefix, identifier);
            try {
                yield client_1.default.del(key);
            }
            catch (error) {
                logger_1.default.error(`[CacheService] DEL Error [${key}]:`, error);
            }
        });
    }
    invalidatePattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPattern = `${this.root}:${pattern}`;
            try {
                const keys = yield client_1.default.keys(fullPattern);
                if (keys.length > 0) {
                    yield client_1.default.del(...keys);
                    logger_1.default.info(`[CacheService] Invalidated ${keys.length} keys for pattern: ${fullPattern}`);
                }
            }
            catch (error) {
                logger_1.default.error(`[CacheService] Pattern Invalidation Error [${fullPattern}]:`, error);
            }
        });
    }
}
exports.cacheService = new CacheService();

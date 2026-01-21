import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../utils/cacheService';
import logger from '../utils/logger';

interface CacheOptions {
    ttl?: number;
    useUserPrefix?: boolean;
    prefix: string; // Required logic domain (e.g. 'reviews', 'recs')
}

/**
 * Professional Cache Middleware
 * - Intercepts GET requests
 * - Normalizes query parameters for consistent keys
 * - Supports bypass via 'x-refresh-cache' header
 */
export const cacheMiddleware = (options: CacheOptions) => {
    const { ttl, useUserPrefix = false, prefix } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Allow bypassing cache via header
        if (req.headers['x-refresh-cache'] === 'true') {
            return next();
        }

        let identifier = req.path;

        // Normalize and append query parameters for deterministic keys
        const queryParams = Object.keys(req.query).sort();
        if (queryParams.length > 0) {
            const queryString = queryParams
                .map(key => `${key}=${req.query[key]}`)
                .join('&');
            identifier += `?${queryString}`;
        }

        // If user-specific caching is required
        if (useUserPrefix) {
            const userId = (req as any).auth?.userId;
            if (userId) {
                identifier = `${userId}:${identifier}`;
            }
        }

        // 1. Try to fetch from cache
        const cachedResponse = await cacheService.get(prefix, identifier);
        if (cachedResponse) {
            // logger.debug(`[Cache] HIT [${prefix}:${identifier}]`);
            return res.status(200).json(cachedResponse);
        }

        // 2. Wrap res.json to capture response
        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            // Cache successful responses only
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheService.set(prefix, identifier, body, ttl).catch(err =>
                    logger.error(`[Cache] Set Error [${prefix}:${identifier}]:`, err)
                );
            }
            return originalJson(body);
        };

        next();
    };
};

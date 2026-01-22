import redis from '../redis/client';
import logger from './logger';
import { CACHE_CONFIG } from '../config/cache.config';

/**
 * CacheService provides a professional wrapper around Redis.
 * Features:
 * - Deterministic Namespacing (nexus:v1:prefix:identifier)
 * - Strict Generic Typing
 * - Silent Error Handling with Logging
 * - Pattern-based Invalidation
 */
class CacheService {
    private readonly root = CACHE_CONFIG.ROOT_PREFIX;

    /**
     * Internal key generator for consistent namespacing
     */
    private buildKey(prefix: string, identifier: string): string {
        return `${this.root}:${prefix}:${identifier}`;
    }

    /**
     * Get a value from the cache.
     * @param prefix Logic namespace (e.g. 'recs')
     * @param identifier Specific key (e.g. userId)
     */
    async get<T>(prefix: string, identifier: string): Promise<T | null> {
        const key = this.buildKey(prefix, identifier);
        try {
            const data = await redis.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (error) {
            logger.error(`[CacheService] GET Error [${key}]:`, error);
            return null;
        }
    }

    /**
     * Set a value in the cache with a TTL.
     * @param prefix Logic namespace
     * @param identifier Specific key
     * @param value Data to cache
     * @param ttlSeconds Expiration in seconds (uses domain default if omitted)
     */
    async set(prefix: string, identifier: string, value: any, ttlSeconds?: number): Promise<void> {
        const key = this.buildKey(prefix, identifier);
        const ttl = ttlSeconds || (CACHE_CONFIG.TTL as any)[prefix.toUpperCase()] || CACHE_CONFIG.DEFAULT_TTL;

        try {
            const stringData = JSON.stringify(value);
            await redis.setex(key, ttl, stringData);
            // logger.debug(`[CacheService] SET [${key}] TTL:${ttl}`);
        } catch (error) {
            logger.error(`[CacheService] SET Error [${key}]:`, error);
        }
    }

    /**
     * Delete a specific key from the cache.
     */
    async del(prefix: string, identifier: string): Promise<void> {
        const key = this.buildKey(prefix, identifier);
        try {
            await redis.del(key);
        } catch (error) {
            logger.error(`[CacheService] DEL Error [${key}]:`, error);
        }
    }

    /**
     * Invalidate all keys matching a specific pattern.
     * Professionally handles cache clearing when data changes.
     * @param pattern Part of the key after the root (e.g. 'reviews:*')
     */
    async invalidatePattern(pattern: string): Promise<void> {
        const fullPattern = `${this.root}:${pattern}`;
        try {
            const keys = await redis.keys(fullPattern);
            if (keys.length > 0) {
                await redis.del(...keys);
                logger.info(`[CacheService] Invalidated ${keys.length} keys for pattern: ${fullPattern}`);
            }
        } catch (error) {
            logger.error(`[CacheService] Pattern Invalidation Error [${fullPattern}]:`, error);
        }
    }
}

export const cacheService = new CacheService();
export { CACHE_CONFIG };

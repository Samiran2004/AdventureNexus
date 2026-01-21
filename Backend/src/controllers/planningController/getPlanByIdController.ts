import { NextFunction, Request, Response } from 'express';
import Plan from '../../database/models/planModel';
import redis from '../../redis/client';
import createHttpError from 'http-errors';
import logger from '../../utils/logger';

/**
 * Controller to get a specific Plan by ID.
 * Implements Redis Caching strategy:
 * 1. Check Redis Cache for data.
 * 2. If hit, return cached data.
 * 3. If miss, fetch from DB, cache it, and return.
 */
export const getPlanById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const redisKey = `${id}`;

        // 1. Try to fetch from Redis cache
        try {
            const cacheData = await redis.get(redisKey);
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }
        } catch (redisErr) {
            // Log Redis error but don't fail the request - fall back to DB
            logger.error(`Redis error in getPlanById: ${redisErr}`);
        }

        // 2. Cache MISS or Redis Error: Find the plan in the database
        const plan = await Plan.findById(id);
        if (plan) {
            // 3. Attempt to cache the plan data in Redis (TTL: 60 seconds)
            try {
                await redis.setex(redisKey, 60, JSON.stringify(plan));
            } catch (redisErr) {
                logger.error(`Redis setex error in getPlanById: ${redisErr}`);
            }

            return res.status(200).json({
                status: 'Success',
                data: plan,
            });
        }

        return next(
            createHttpError(404, 'Plan Not Found or The ID is Invalid.')
        );

    } catch (err: any) {
        logger.error(`Error in getPlanByIdController: ${err.message || err}`);
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

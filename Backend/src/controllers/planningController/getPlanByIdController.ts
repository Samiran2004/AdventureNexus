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

        // Define Redis key (Using simple ID, might conflict if other entities share ID space, but MongoIDs are unique)
        const redisKey = `${id}`;

        // 1. Check Redis cache
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                // Return 200 with normal DB fetch instead? Or error? Choosing error for now.
                return next(
                    createHttpError(500, 'Internal Redis Server Error!')
                );
            }
            if (cacheData) {
                // Cache HIT
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }

            // 2. Cache MISS: Find the plan in the database
            try {
                const plan = await Plan.findById(id);
                if (plan) {
                    // 3. Cache the plan data in Redis (TTL: 60 seconds)
                    redis.setex(redisKey, 60, JSON.stringify(plan));
                    return res.status(200).json({
                        status: 'Success',
                        data: plan,
                    });
                }
                return next(
                    createHttpError(404, 'Plan Not Found or The id is Invalid.')
                );
            } catch {
                return next(
                    createHttpError(400, 'Plan Not Found or The ID is Invalid.')
                );
            }
        });
    } catch {
        logger.error(`Error in getPlanByIdController: ${error}`);
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

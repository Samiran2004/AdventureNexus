import { NextFunction, Request, Response } from 'express';
import Plan from '../../Database/models/planModel';
import redis from '../../redis/client';
import createHttpError from 'http-errors';

export const getPlanById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // Define Redis key
        const redisKey = `${id}`;

        // Check Redis cache
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                return next(
                    createHttpError(500, 'Internal Redis Server Error!')
                );
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData),
                });
            }

            // Find the plan in the database
            try {
                const plan = await Plan.findById(id);
                if (plan) {
                    // Cache the plan data in Redis
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
        // console.error(`Error in getPlanByIdController: ${error}`); // Log the error for debugging
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

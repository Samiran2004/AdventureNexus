import { Request, Response } from 'express';
import Plan from '../../models/planModel';
import redis from '../../redis/client';

export const getPlanById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Define Redis key
        const redisKey = `${id}`;

        // Check Redis cache
        redis.get(redisKey, async (err, cacheData) => {
            if (err) {
                return res.status(500).json({
                    status: 'Failed',
                    message: "Internal Redis Error."
                });
            }
            if (cacheData) {
                return res.status(200).json({
                    status: 'Success',
                    data: JSON.parse(cacheData)
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
                        data: plan
                    });
                }
                return res.status(404).json({
                    status: 'Failed',
                    message: "Plan Not Found or The ID is Invalid."
                });

            } catch (error) {
                return res.status(400).json({
                    status: 'Failed',
                    message: "Plan Not Found or The ID is Invalid."
                });
            }
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
};

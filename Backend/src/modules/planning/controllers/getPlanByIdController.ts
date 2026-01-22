import { NextFunction, Request, Response } from 'express';
import Plan from '../../../shared/database/models/planModel';
import createHttpError from 'http-errors';
import logger from '../../../shared/utils/logger';

/**
 * Controller to get a specific Plan by ID.
 * Caching is handled at the route level via cacheMiddleware.
 */
export const getPlanById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id);

        if (!plan) {
            return next(
                createHttpError(404, 'Plan Not Found or The ID is Invalid.')
            );
        }

        return res.status(200).json({
            status: 'Success',
            data: plan,
        });

    } catch (err: any) {
        logger.error(`Error in getPlanByIdController: ${err.message || err}`);
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

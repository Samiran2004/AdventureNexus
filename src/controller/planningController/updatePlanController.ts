import { NextFunction, Request, Response } from 'express';
import Plan from '../../models/planModel';
import User from '../../models/userModel';
import createHttpError from 'http-errors';

interface UpdatePlanRequestBody {
    destination?: string;
    dispatch_city?: string;
    travel_dates?: {
        start_date?: string;
        end_date?: string;
    };
    budget?: string;
    total_people?: number;
    flights?: any; // Replace 'any' with a specific type if available
    hotels?: any; // Replace 'any' with a specific type if available
}

export interface CustomRequestUpdatePlan<TParams = {}, TQuery = {}, TBody = {}>
    extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    };
}
export interface RequestParamsUpdatePlan {
    id: string;
}

export const updatePlan = async (
    req: CustomRequestUpdatePlan<RequestParamsUpdatePlan>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params; // Extracting plan ID from the URL parameters
        const updates = req.body; // Extracting the updates from the request body

        // Find the plan by ID
        const plan = await Plan.findById(id);
        if (!plan) {
            return next(createHttpError(404, 'Plan Not Found!'));
        }

        // Check if the plan belongs to the user
        if (plan.user.toString() !== req.user._id) {
            return next(
                createHttpError(
                    403,
                    'You do not permission to update this plan'
                )
            );
        }

        // Update the plan with the provided fields
        Object.assign(plan, updates);
        const updatedPlan = await plan.save();

        // Return the updated plan
        return res.status(200).json({
            status: 'Success',
            message: 'Plan updated successfully.',
            data: updatedPlan,
        });
    } catch (error) {
        // console.error(error); // Log the error for debugging
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

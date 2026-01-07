import { NextFunction, Request, Response } from 'express';
import User from '../../database/models/userModel';
import Plan from '../../database/models/planModel';
import createHttpError from 'http-errors';

export interface CustomRequestDeletePlan extends Request {
    user: {
        _id: string;
    };
}

/**
 * Controller to delete a Travel Plan by ID.
 * Ensures that plans can only be deleted by the user who owns them.
 *
 * @param req - Custom Request includes authenticated user ID and Plan ID params
 * @param res - Express Response object
 * @param next - Express Next function
 */
export const deletePlanById = async (
    req: CustomRequestDeletePlan,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const id: string = req.params.id; // Plan ID to be deleted
        const userId = req.user._id; // Logged-in user's ID

        // 1. Check if the plan exists
        const plan = await Plan.findById(id);
        if (!plan) {
            return next(createHttpError(404, 'Plan Not Found!'));
        }

        // 2. Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, 'User not found!'));
        }

        // 3. Verify Ownership: Check if the plan belongs to the user
        // Note: Can also check plan.userId === userId directly
        if (!user.plans.some(planId => planId.toString() == id)) {
            return next(
                createHttpError(403, 'This plan does not belong to the user!')
            );
        }

        // 4. Update User's Plan List (Remove reference)
        user.plans = user.plans.filter(planId => planId.toString() !== id);

        // 5. Save the updated user document
        await user.save();

        // 6. Delete the plan from the Plan collection
        await Plan.findByIdAndDelete(id);

        return res.status(200).json({
            status: 'Success',
            message: 'Plan deleted successfully.',
        });
    } catch {
        // console.log(`Error in deletePlanByIdController: ${error}`);  //For Debugging

        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

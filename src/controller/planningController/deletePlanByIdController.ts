import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import Plan from '../../models/planModel';
import createHttpError from 'http-errors';

export interface CustomRequestDeletePlan extends Request {
    user: {
        _id: string
    }
}

export const deletePlanById = async (
    req: CustomRequestDeletePlan,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
        const id: string = req.params.id; // Plan ID to be deleted
        const userId = req.user._id; // Logged-in user's ID

        // Check if the plan exists
        const plan = await Plan.findById(id);
        if (!plan) {
            return next(createHttpError(404, "Plan Not Found!"));
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, "User not found!"));
        }

        // Check if the plan belongs to the user
        if (!user.plans.some((planId) => planId.toString() == id)) {
            return next(createHttpError(403, "This plan does not belong to the user!"));
        }

        // Remove the plan reference from the user's plans array
        user.plans = user.plans.filter(planId => planId.toString() !== id);

        // Save the updated user document
        await user.save();

        // Delete the plan from the Plan collection
        await Plan.findByIdAndDelete(id);

        return res.status(200).json({
            status: 'Success',
            message: 'Plan deleted successfully.'
        });

    } catch (error) {
        // console.log(`Error in deletePlanByIdController: ${error}`);  //For Debugging

        return next(createHttpError(500, "Internal Server Error!"));
    }
};

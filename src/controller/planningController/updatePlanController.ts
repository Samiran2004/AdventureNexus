import { Request, Response } from 'express';
import Plan from '../../models/planModel';
import User from '../../models/userModel';

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

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string
    }
}
interface RequestParams {
    id: string;
}

export const updatePlan = async (req: CustomRequest<RequestParams>, res: Response) => {
    try {
        const { id } = req.params; // Extracting plan ID from the URL parameters
        const updates = req.body; // Extracting the updates from the request body

        // Find the plan by ID
        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Plan not found.'
            });
        }

        // Check if the plan belongs to the user
        if (plan.user.toString() !== req.user._id) {
            return res.status(403).json({
                status: 'Failed',
                message: 'You do not have permission to update this plan.'
            });
        }

        // Update the plan with the provided fields
        Object.assign(plan, updates);
        const updatedPlan = await plan.save();

        // Return the updated plan
        return res.status(200).json({
            status: 'Success',
            message: 'Plan updated successfully.',
            data: updatedPlan
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            status: 'Failed',
            message: 'Internal Server Error.'
        });
    }
};

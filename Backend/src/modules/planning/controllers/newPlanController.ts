import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Plan from "../../../shared/database/models/planModel";
import User from "../../../shared/database/models/userModel";

/**
 * Controller to create a new Travel Plan (Draft/Manual).
 * Saves the provided trip data to the database and links it to the user.
 */
export const createPlan = async (req: Request, res: Response) => {
    try {
        const { 
            to, 
            from, 
            date, 
            budget, 
            travelers, 
            name, 
            days, 
            suggested_itinerary,
            budget_breakdown,
            image_url,
            destination_overview
        } = req.body;

        const userId = req.user?._id;
        const clerkUserId = req.user?.clerkUserId;

        if (!userId || !clerkUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'Failed',
                message: 'User not authenticated'
            });
        }

        // 1. Validate Required Fields
        if (!to || !from || !date || !budget || !travelers) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: 'Missing required fields: to, from, date, budget, travelers'
            });
        }

        // 2. Create New Plan
        const newPlan = new Plan({
            userId,
            clerkUserId,
            to,
            from,
            date,
            budget,
            travelers,
            name: name || `Trip to ${to}`,
            days: days || (suggested_itinerary ? suggested_itinerary.length : 1),
            suggested_itinerary: suggested_itinerary || [],
            budget_breakdown: budget_breakdown || {
                flights: 0,
                accommodation: 0,
                activities: 0,
                food: 0,
                total: budget
            },
            image_url: image_url || '',
            destination_overview: destination_overview || ''
        });

        await newPlan.save();

        // 3. Link Plan to User
        await User.findByIdAndUpdate(userId, {
            $push: { plans: newPlan._id }
        });

        return res.status(StatusCodes.CREATED).json({
            status: 'Success',
            message: 'Trip saved successfully',
            data: newPlan
        });

    } catch (error) {
        console.error('[createPlan Error]:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
}
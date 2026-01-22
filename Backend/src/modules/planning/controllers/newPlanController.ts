import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

/**
 * Controller to create a new Travel Plan (Draft/Manual).
 * Currently only validates input presence.
 * Warning: Does not save to DB in this snippet! This might be incomplete or a placeholder.
 */
export const createPlan = async (req: Request, res: Response) => {
    try {
        const { destination, dispatch_city, travel_dates, budget, total_people } = req.body;

        // 1. Validate Required Fields
        if (!destination || !dispatch_city || !travel_dates || !budget || !total_people) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.BAD_REQUEST)
            });
        }

        // TODO: Logic to save plan to database is missing? 
        // Or this is valid input check only?

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
}
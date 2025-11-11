import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { destination, dispatch_city, travel_dates, budget, total_people } = req.body;
        if (!destination || !dispatch_city || !travel_dates || !budget || !total_people) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'Failed',
                message: getReasonPhrase(StatusCodes.BAD_REQUEST)
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
}
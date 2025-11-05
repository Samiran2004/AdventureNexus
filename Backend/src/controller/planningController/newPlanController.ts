import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const createPlan = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'Failed',
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error
        });
    }
}
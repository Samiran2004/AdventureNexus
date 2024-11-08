import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../models/userModel';
import createHttpError from 'http-errors';

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    }
}

const getUserHistory = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Fetch the user id from the token
        const userId = req.user._id as string;

        // Check if the user exists in the database
        const user: IUser | null = await User.findById(userId).populate('recommendationhistory').lean();
        if (!user) {
            return next(createHttpError(404, "User Not Found!"));
        }

        // Return user recommendation history
        return res.status(200).send({
            status: 'Success',
            data: user.recommendationhistory,
        });
    } catch (error) {
        // console.error('Error fetching user history:', error); // Log for Debugging
        return next(createHttpError(500, "Internal Server Error!"));
    }
};

export default getUserHistory;

import { Request, Response } from 'express';
import User, { IUser } from '../../models/userModel';

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    }
}

const getUserHistory = async (req: CustomRequest, res: Response) => {
    try {
        // Fetch the user id from the token
        const userId = req.user._id as string;

        // Check if the user exists in the database
        const user: IUser | null = await User.findById(userId).populate('recommendationhistory').lean();
        if (!user) {
            return res.status(404).send({
                status: 'Failed',
                message: 'User Not Found.',
            });
        }

        // Return user recommendation history
        return res.status(200).send({
            status: 'Success',
            data: user.recommendationhistory,
        });
    } catch (error) {
        console.error('Error fetching user history:', error); // Log the error
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal Server Error',
        });
    }
};

export default getUserHistory;

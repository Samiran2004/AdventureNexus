import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../Database/models/userModel';
import createHttpError from 'http-errors';

export interface CustomRequestUserProfileController<
    TParams = object,
    TQuery = object,
    TBody = object,
> extends Request<TParams, unknown, TBody, TQuery> {
    user: {
        _id: string;
    };
}

async function userProfile(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userData: IUser | null = await User.findOne({ clerkUserId: req.user.clerkUserId });

        if (!userData) {
            return next(createHttpError(404, 'User not found!'));
        } else {
            return res.status(200).send({
                status: 'Success',
                userData: {
                    fullname: userData.fullname,
                    firstname: userData.firstName,
                    lastname: userData.lastName,
                    email: userData.email,
                    phonenumber: userData.phonenumber,
                    username: userData.username,
                    gender: userData.gender,
                    profilepicture: userData.profilepicture,
                    preference: userData.preferences,
                    country: userData.country,
                },
            });
        }
    } catch (error: unknown) {
        console.error("Error fetching user profile:", error); // Log error for debugging
        return next(createHttpError(500, 'Internal Server Error!'));
    }
}

export default userProfile;

import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../../shared/database/models/userModel';
import createHttpError from 'http-errors';
import logger from '../../../shared/utils/logger';
import { clerkClient } from '@clerk/express';

// Interface extending Express Request to include user ID from auth middleware
export interface CustomRequestUserProfileController<
    TParams = object,
    TQuery = object,
    TBody = object,
> extends Request<TParams, unknown, TBody, TQuery> {
    user: {
        _id: string;
        clerkUserId: string;
    };
}

/**
 * Controller to fetch User Profile.
 * Retrieves user data from MongoDB based on Clerk User ID.
 *
 * @param req - Custom Request object containing authenticated user info
 * @param res - Express Response object
 * @param next - Express Next function for error handling
 */
async function userProfile(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        // 1. Find user by Clerk ID (attached by protect middleware)
        let userData: IUser | null = await User.findOne({ clerkUserId: req.user.clerkUserId });

        // --- REAL-TIME SYNC FALLBACK ---
        if (!userData) {
            logger.info(`🔍 Auth user ${req.user.clerkUserId} not in DB, syncing from Clerk...`);
            try {
                const clerkUser = await clerkClient.users.getUser(req.user.clerkUserId);
                if (clerkUser) {
                    userData = await User.findOneAndUpdate(
                        { clerkUserId: req.user.clerkUserId },
                        {
                            clerkUserId: clerkUser.id,
                            email: clerkUser.emailAddresses[0]?.emailAddress,
                            username: clerkUser.username || clerkUser.externalAccounts[0]?.username || `traveler_${clerkUser.id.substring(0, 5)}`,
                            firstName: clerkUser.firstName,
                            lastName: clerkUser.lastName,
                            fullname: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Traveler',
                            profilepicture: clerkUser.imageUrl,
                        },
                        { upsert: true, new: true }
                    );
                    logger.info(`✅ Auth user synced successfully.`);
                }
            } catch (clerkError: any) {
                logger.error(`❌ Auth user Clerk sync failed: ${clerkError.message}`);
            }
        }

        // 2. Handle User Not Found
        if (!userData) {
            return next(createHttpError(404, 'User not found!'));
        } else {
            // 3. Send Success Response with filtered user data
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
        logger.error("Error fetching user profile:", error); // Log error for debugging
        return next(createHttpError(500, 'Internal Server Error!'));
    }
}

export default userProfile;

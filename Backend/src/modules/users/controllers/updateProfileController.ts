import { NextFunction, Request, Response } from 'express';
import User from '../../../shared/database/models/userModel';
import createHttpError from 'http-errors';
import logger from '../../../shared/utils/logger';
import { clerkClient } from '@clerk/express';

/**
 * Controller to update User Profile.
 * Updates both Clerk data and MongoDB custom fields.
 */
export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const clerkUserId = req.auth()?.userId;
        if (!clerkUserId) {
            return next(createHttpError(401, 'Unauthorized'));
        }

        const {
            firstName,
            lastName,
            fullname,
            bio,
            coverImage,
            phonenumber,
            gender,
            country,
            preferences
        } = req.body;

        // 1. Update Clerk if firstName/lastName provided
        if (firstName || lastName) {
            try {
                await clerkClient.users.updateUser(clerkUserId, {
                    firstName,
                    lastName,
                });
                logger.info(`✅ Clerk user ${clerkUserId} updated`);
            } catch (clerkError: any) {
                logger.error(`❌ Clerk update failed: ${clerkError.message}`);
                // Continue with DB update even if Clerk fails (or could return error)
            }
        }

        // 2. Update MongoDB
        const updateData: any = {};
        if (fullname !== undefined) updateData.fullname = fullname;
        if (bio !== undefined) updateData.bio = bio;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (phonenumber !== undefined) updateData.phonenumber = phonenumber;
        if (gender !== undefined) updateData.gender = gender;
        if (country !== undefined) updateData.country = country;
        if (preferences !== undefined) updateData.preferences = preferences;

        // Also sync names if they changed
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;

        const updatedUser = await User.findOneAndUpdate(
            { clerkUserId },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error: any) {
        logger.error('Error updating profile:', error);
        return next(createHttpError(500, 'Failed to update profile'));
    }
};

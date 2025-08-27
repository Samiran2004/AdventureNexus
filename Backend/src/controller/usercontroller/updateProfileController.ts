import { NextFunction, Request, Response } from 'express';
import User from '../../Database/models/userModel';
import generateRandomUserName from '../../utils/generateRandomUserName';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import cloudinary from '../../service/cloudinaryService';
import fs from 'fs';
import { Readable } from 'stream';

interface RequestBody {
    fullname: string;
    gender?: 'male' | 'female' | 'other';
    preference?: string[];
    country?: string;
    password?: string;
}
interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: Readable;
}

export interface CustomRequestUpdateProfilePicture<
    TParams = {},
    TQuery = {},
    TBody = {},
> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    };
    file: MulterFile;
}

export interface CustomRequestUpdateProfile<
    TParams = {},
    TQuery = {},
    TBody = RequestBody,
> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    };
}

const updateProfile = async (
    req: CustomRequestUpdateProfile,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        // Fetch the user by ID
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) return next(createHttpError(404, 'User not found.'));

        const { fullname, gender, preference, country, password } = req.body;

        if (
            !fullname &&
            !gender &&
            !preference &&
            !country &&
            !password &&
            !(req as CustomRequestUpdateProfilePicture).file?.path
        ) {
            return next(
                createHttpError(
                    400,
                    'Please provide at least one field to update.'
                )
            );
        }

        // Update each field if provided
        if (fullname && fullname != checkUser.fullname) {
            checkUser.fullname = fullname;
            try {
                checkUser.username = (await generateRandomUserName(
                    fullname
                )) as string;
            } catch (error) {
                return next(createHttpError(500, 'Error generating username.'));
            }
        }

        if (gender) checkUser.gender = gender;
        if (preference) checkUser.preferences = preference;
        if (country) checkUser.country = country;

        // Update password if provided
        if (password) {
            const salt: string = await bcrypt.genSalt(10);
            checkUser.password = await bcrypt.hash(password, salt);
        }

        // Update profile picture
        let uploadImageUrl: { url: string };
        if ((req as CustomRequestUpdateProfilePicture).file?.path) {
            try {
                uploadImageUrl = await cloudinary.uploader.upload(
                    (req as CustomRequestUpdateProfilePicture).file.path
                );
                fs.unlinkSync(
                    (req as CustomRequestUpdateProfilePicture).file.path
                );
                const previousProfilePictureUrl: string =
                    checkUser.profilepicture;
                checkUser.profilepicture = uploadImageUrl.url;

                // Delete the previous profile picture from Cloudinary if it exists
                if (previousProfilePictureUrl) {
                    const publicId: string | undefined =
                        previousProfilePictureUrl
                            .split('/')
                            .pop()
                            ?.split('.')[0];
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(publicId);
                        } catch (error) {
                            console.error(
                                'Error deleting previous profile picture:',
                                error
                            );
                            return next(
                                createHttpError(
                                    500,
                                    'Profile picture update failed.'
                                )
                            );
                        }
                    }
                }
            } catch (error) {
                return next(
                    createHttpError(500, 'Profile picture upload failed.')
                );
            }
        }

        // Save the updated user data
        await checkUser.save();

        return res.status(200).send({
            status: 'Success',
            message: 'User updated.',
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                profilepicture: checkUser.profilepicture,
                _id: checkUser._id,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

export default updateProfile;

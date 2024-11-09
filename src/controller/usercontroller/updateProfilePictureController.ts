import {NextFunction, Request, Response} from 'express';
import User, {IUser} from '../../models/userModel';
import cloudinary from '../../service/cloudinaryService';
import { Readable } from 'stream';
import fs from 'fs';
import createHttpError from "http-errors";

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

interface CustomRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    }
    file: MulterFile;
}

const updateProfilePicture = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Check if the user exists
        const checkUser: IUser | null = await User.findById(req.user._id);
        if (!checkUser) {
            return next(createHttpError(404, "User not found."));
        }

        // Upload new profile picture to Cloudinary
        let uploadImageUrl: { url: string };
        try {
            uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path); // Remove from local storage
        } catch (error) {
            return next(createHttpError(500, "Profile picture upload failed."));
        }

        // Save the new profile picture URL to the user document
        const previousProfilePictureUrl: string = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();

        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                // Safeguard by checking if previousProfilePictureUrl has both "/" and "." before proceeding
                const segments: string[] = previousProfilePictureUrl.split('/');
                const fileName: string | undefined = segments.pop(); // Get the last segment which should be the file name

                // Ensure fileName exists and contains a dot before trying to split it
                const publicId: string | undefined = fileName?.split('.')[0];

                // Proceed with deletion only if publicId is valid
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                } else {
                    return next(createHttpError(500, "Profile picture update failed."));
                }
            } catch (error) {
                return next(createHttpError(500, "Profile picture updated but previous image could not be deleted from Cloudinary."));
            }
        }

        // Success response
        return res.status(200).send({
            status: 'Success',
            message: 'Profile picture updated successfully.',
            profilepicture: uploadImageUrl.url
        });

    } catch (error) {
        // console.error("Error updating profile picture:", error); // Log error for debugging
        return next(createHttpError(500, "Internal Server Error!"));
    }
};

export default updateProfilePicture;

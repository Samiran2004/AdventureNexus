import { Request, Response } from 'express';
import User from '../../models/userModel'; // Adjust the import according to your TypeScript setup
import cloudinary from '../../service/cloudinaryService';
import { Readable } from 'stream';
import fs from 'fs';

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

const updateProfilePicture = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        // Check if the user exists
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }

        // Upload new profile picture to Cloudinary
        let uploadImageUrl: { url: string };
        try {
            uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path); // Remove from local storage
        } catch (error) {
            return res.status(500).send({
                status: 'Failed',
                message: "Profile picture upload failed."
            });
        }

        // Save the new profile picture URL to the user document
        const previousProfilePictureUrl: string = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();

        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                // Safeguard by checking if previousProfilePictureUrl has both "/" and "." before proceeding
                const segments = previousProfilePictureUrl.split('/');
                const fileName = segments.pop(); // Get the last segment which should be the file name

                // Ensure fileName exists and contains a dot before trying to split it
                const publicId = fileName?.split('.')[0];

                // Proceed with deletion only if publicId is valid
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                } else {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "Profile picture updated but previous image could not be identified for deletion.",
                    });
                }
            } catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Profile picture updated but previous image could not be deleted from Cloudinary."
                });
            }
        }

        // Success response
        return res.status(200).send({
            status: 'Success',
            message: 'Profile picture updated successfully.',
            profilepicture: uploadImageUrl.url
        });

    } catch (error) {
        console.error("Error updating profile picture:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
};

export default updateProfilePicture;

import { Request, Response } from 'express';
import User from '../../models/userModel'; // Adjust the import according to your TypeScript setup
import cloudinary from '../../service/cloudinaryService';
import fs from 'fs';

const updateProfilePicture = async (req: Request, res: Response): Promise<Response> => {
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
        const previousProfilePictureUrl = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();

        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                const publicId = previousProfilePictureUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
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

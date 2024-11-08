import { Request, Response } from 'express';
import cloudinary from '../../service/cloudinaryService';
import User from '../../models/userModel'; // Adjust the import according to your TypeScript setup
import sendMail from '../../service/mailService';
import { deleteUserEmailData } from '../../utils/emailTemplate';

const userDelete = async (req: Request, res: Response) => {
    try {
        // Check if the user exists
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "Not a valid user."
            });
        } else {
            // Delete profile picture from Cloudinary
            const profilePictureUrl = checkUser.profilepicture;
            const publicId = profilePictureUrl.split('/').pop()?.split('.')[0]; // Optional chaining

            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "Error deleting profile picture from Cloudinary",
                        error: error.message
                    });
                }
            }

            // Delete user from the database
            await User.findByIdAndDelete(req.user._id);

            // Send a mail
            const emailData = deleteUserEmailData(checkUser.fullname, checkUser.email);
            await sendMail(emailData, (error) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "User deleted, but email sending failed"
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    message: "User deleted."
                });
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error.",
            error: error.message 
        });
    }
};

export default userDelete;

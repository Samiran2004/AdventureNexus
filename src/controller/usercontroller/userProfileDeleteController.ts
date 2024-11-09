import {NextFunction, Request, Response} from 'express';
import cloudinary from '../../service/cloudinaryService';
import User, {IUser} from '../../models/userModel';
import sendMail from '../../service/mailService';
import createHttpError from "http-errors";
import emailTemplates, {EmailData} from "../../utils/emailTemplate";

interface CustomRequest extends Request{
    user: {
        _id: string,
    }
}

const userDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if the user exists
        const checkUser: IUser | null = await User.findById((req as CustomRequest).user._id);
        if (!checkUser) {
            return next(createHttpError(404, "Not a valid user."));
        } else {
            // Delete profile picture from Cloudinary
            const profilePictureUrl: string = checkUser.profilepicture;
            const publicId: string | undefined = profilePictureUrl.split('/').pop()?.split('.')[0]; // Optional chaining

            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    return next(createHttpError(500, "Error deleting profile picture from Cloudinary"));
                }
            }

            // Delete user from the database
            await User.findByIdAndDelete((req as CustomRequest).user._id);

            // Send a mail
            const emailData: EmailData = emailTemplates.deleteUserEmailData(checkUser.fullname, checkUser.email);
            await sendMail(emailData, (error: Error | null) => {
                if (error) {
                    return next(createHttpError(500, "User deleted, but email sending failed!"));
                }
                return res.status(200).send({
                    status: 'Success',
                    message: "User deleted."
                });
            });
        }
    } catch (error) {
        return next(createHttpError(500, "Internal Server Error!"));
    }
};

export default userDelete;

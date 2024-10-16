import { Request, Response } from 'express';
import User from '../../models/userModel'; // Adjust the import according to your TypeScript setup

async function userProfile(req: Request, res: Response): Promise<Response> {
    try {
        const userData = await User.findById(req.user._id);
        
        if (!userData) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        } else {
            return res.status(200).send({
                status: 'Success',
                userData: {
                    fullname: userData.fullname,
                    email: userData.email,
                    phonenumber: userData.phonenumber,
                    username: userData.username,
                    gender: userData.gender,
                    profilepicture: userData.profilepicture,
                    preference: userData.preferences,
                    country: userData.country
                }
            });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
}

export default userProfile;

import { Request, Response } from 'express';
import User from '../../models/userModel'; // Adjust the import according to your TypeScript setup
import generateRandomUserName from '../../utils/generateRandomUserName';
import bcrypt from 'bcryptjs';

interface RequestBody {
    fullname: string;
    gender: "male" | "female" | "other";
    preference: string[];
    country: string;
    password: string;
}

interface CustomRequest<TParams = {}, TQuery = {}, TBody = RequestBody> extends Request<TParams, any, TBody, TQuery> {
    user: {
        _id: string;
    }
}

const updateProfile = async (req: CustomRequest, res: Response) => {
    try {
        // Fetch the user using id
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }

        const { fullname, gender, preference, country, password } = req.body;

        if (!fullname && !gender && !preference && !country && !password) {
            return res.status(400).send({
                status: 'Failed',
                message: "Please provide at least one field to update."
            });
        }

        if (fullname) {
            checkUser.fullname = fullname;
            try {
                const username = await generateRandomUserName(fullname);
                checkUser.username = username;
            } catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Error generating username."
                });
            }
        }

        if (gender) {
            checkUser.gender = gender;
        }

        if (preference) {
            checkUser.preferences = preference;
        }

        if (country) {
            checkUser.country = country;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(password, salt);
            checkUser.password = newHashedPassword;
        }

        // Save the updated data
        await checkUser.save();

        return res.status(200).send({
            status: 'Success',
            message: "User updated.",
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                _id: checkUser._id
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error); // Log error for debugging
        return res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
};

export default updateProfile;

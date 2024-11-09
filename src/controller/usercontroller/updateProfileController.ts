import {NextFunction, Request, Response} from 'express';
import User from '../../models/userModel';
import generateRandomUserName from '../../utils/generateRandomUserName';
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";

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

const updateProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Fetch the user using id
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return next(createHttpError(404, "User not found."));
        }

        const { fullname, gender, preference, country, password } = req.body;

        if (!fullname && !gender && !preference && !country && !password) {
            return next(createHttpError(400, "Please provide at least one field to update."));
        }

        if (fullname) {
            checkUser.fullname = fullname;
            try {
                const username = await generateRandomUserName(fullname);
                checkUser.username = username;
            } catch (error) {
                return next(createHttpError(500, "Error generating username."));
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
            const salt: string = await bcrypt.genSalt(10);
            checkUser.password = await bcrypt.hash(password, salt);
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
        // console.error("Error updating profile:", error); // Log error for debugging
        return next(createHttpError(500, "Internal Server Error!"));
    }
};

export default updateProfile;

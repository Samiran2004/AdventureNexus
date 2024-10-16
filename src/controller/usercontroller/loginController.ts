import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/userModel'; // Adjust the import path based on your project structure
import bcryptjs from 'bcryptjs';
import userSchemaValidation from '../../utils/JoiUtils/joiLoginValidation';

const loginuser = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch all user data from req.body
        const { username, email, password } = req.body;

        // Check if all required fields are provided in the request body
        if (!username || !email || !password) {
            return res.status(400).send({
                status: 'Failed',
                message: 'All fields are required.',
            });
        }

        // Validate user data using JOI
        const { error } = userSchemaValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'Failed',
                message: error.details[0].message,
            });
        }

        // Find the user in the database
        const checkUser: IUser | null = await User.findOne({ username, email });
        if (checkUser) {
            // Match password
            const matchPassword = await bcryptjs.compare(password, checkUser.password);
            if (matchPassword) {
                // Create JWT Token
                const userPayload = {
                    fullname: checkUser.fullname,
                    email: checkUser.email,
                    username: checkUser.username,
                    gender: checkUser.gender,
                    country: checkUser.country,
                    currency_code: checkUser.currency_code,
                    _id: checkUser._id,
                };

                // Access token
                const accessToken = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '1h' });
                // Refresh token
                const refreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
                
                // Save the refresh token into the database for future use
                checkUser.refreshtoken = refreshToken;
                await checkUser.save();

                // Set cookies
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });

                return res.status(200).send({
                    status: 'Success',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            } else {
                return res.status(401).send({
                    status: 'Failed',
                    message: 'Incorrect Password.',
                });
            }
        } else {
            return res.status(404).send({
                status: 'Failed',
                message: 'User not found.',
            });
        }
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal Server Error...',
            error,
        });
    }
};

export default loginuser;
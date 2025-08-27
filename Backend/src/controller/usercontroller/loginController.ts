import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../Database/models/userModel';
import bcryptjs from 'bcryptjs';
import { userSchemaValidationLogin } from '../../utils/JoiUtils/joiLoginValidation';
import createHttpError from 'http-errors';
import { config } from '../../config/config';

const loginuser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        // Fetch all user data from req.body
        const { username, email, password } = req.body;

        // Check if all required fields are provided in the request body
        if (!username || !email || !password) {
            return next(createHttpError(400, 'All fields are required'));
        }

        // Validate user data using JOI
        const { error } = userSchemaValidationLogin.validate(req.body);
        if (error) {
            return next(createHttpError(400, error.details[0].message));
        }

        // Find the user in the database
        const checkUser: IUser | null = await User.findOne({
            username,
            email,
        });
        if (checkUser) {
            // Match password
            const matchPassword = await bcryptjs.compare(
                password,
                checkUser.password
            );
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
                const accessToken = jwt.sign(
                    userPayload,
                    process.env.JWT_ACCESS_SECRET as string,
                    { expiresIn: '1h' }
                );
                // Refresh token
                const refreshToken = jwt.sign(
                    userPayload,
                    process.env.JWT_REFRESH_SECRET as string,
                    { expiresIn: '7d' }
                );

                // Save the refresh token into the database for future use
                checkUser.refreshtoken = refreshToken;
                await checkUser.save();

                // Set cookies
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });

                return res.status(200).send({
                    status: 'Success',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            } else {
                return next(createHttpError(401, 'Incorrect Password'));
            }
        } else {
            return next(createHttpError(404, 'User not found!'));
        }
    } catch(error) {
        if (config.env === 'development') {
            console.error('Error during login:', error); // Log for debugging
        }
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

export default loginuser;

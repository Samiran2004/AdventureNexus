import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../shared/database/models/userModel';
import bcryptjs from 'bcryptjs';
import { userSchemaValidationLogin } from '../../../shared/utils/validators/joiLoginValidation';
import createHttpError from 'http-errors';
import { config } from '../../../shared/config/config';
import logger from '../../../shared/utils/logger';

/**
 * Controller for User Login.
 * Handles user authentication, password validation, and JWT token generation.
 */
const loginuser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        // 1. Extract Credentials
        const { username, email, password } = req.body;

        // 2. Validate Basic Presence
        if (!username || !email || !password) {
            return next(createHttpError(400, 'All fields are required'));
        }

        // 3. Joi Validation for Login Schema
        const { error } = userSchemaValidationLogin.validate(req.body);
        if (error) {
            return next(createHttpError(400, error.details[0].message));
        }

        // 4. Find User by Username and Email
        // Note: Usually login is by username OR email, not both required.
        const checkUser: IUser | null = await User.findOne({
            username,
            email,
        });

        if (checkUser) {
            // 5. Verify Password
            const matchPassword = await bcryptjs.compare(
                password,
                checkUser.password
            );
            if (matchPassword) {
                // 6. Create JWT Payload
                const userPayload = {
                    fullname: checkUser.fullname,
                    email: checkUser.email,
                    username: checkUser.username,
                    gender: checkUser.gender,
                    country: checkUser.country,
                    currency_code: checkUser.currency_code,
                    _id: checkUser._id,
                };

                // 7. Generate Access Token (1h)
                const accessToken = jwt.sign(
                    userPayload,
                    process.env.JWT_ACCESS_SECRET as string,
                    { expiresIn: '1h' }
                );
                // 8. Generate Refresh Token (7d)
                const refreshToken = jwt.sign(
                    userPayload,
                    process.env.JWT_REFRESH_SECRET as string,
                    { expiresIn: '7d' }
                );

                // 9. Store Refresh Token in DB
                checkUser.refreshtoken = refreshToken;
                await checkUser.save();

                // 10. Set Secure Cookies
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });

                // 11. Return Success Response with Tokens
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
    } catch (error) {
        if (config.env === 'development') {
            logger.error('Error during login:', error); // Log for debugging
        }
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

export default loginuser;

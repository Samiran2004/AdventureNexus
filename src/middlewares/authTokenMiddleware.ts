import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from "../models/userModel";
import { config } from "../config/config";

interface UserPayload extends JwtPayload {
    fullname: string;
    email: string;
    username: string;
    gender: string;
    _id: string;
    profilepicture: string;
    country: string;
    currency: string;
}

interface CustomRequest extends Request {
    user?: UserPayload;
}

export default async function authTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const accessToken: string = req.cookies['accessToken'];

        if (!accessToken) {
            res.status(401).send({
                status: 'Unauthorized',
                message: "Access token not found."
            });
            return;
        }

        jwt.verify(accessToken, config.JWT_ACCESS_SECRET as string, async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    try {
                        const userData: IUser | null = await User.findById((user as UserPayload)?._id);
                        if (!userData || !userData.refreshtoken) {
                            res.status(403).send({
                                status: 'Forbidden',
                                message: "Refresh token not found, please login again."
                            });
                            return;
                        }

                        jwt.verify(userData.refreshtoken, config.JWT_REFRESH_SECRET as string, (err, decodedRefreshToken) => {
                            if (err) {
                                res.status(403).send({
                                    status: 'Forbidden',
                                    message: "Invalid refresh token, please login again."
                                });
                                return;
                            }

                            const newUserPayload: UserPayload = {
                                fullname: userData.fullname,
                                email: userData.email,
                                username: userData.username,
                                gender: userData.gender,
                                _id: userData._id as string,
                                profilepicture: userData.profilepicture,
                                country: userData.country as string,
                                currency: userData.currency_code as string
                            };

                            const newAccessToken: string = jwt.sign(newUserPayload, config.JWT_ACCESS_SECRET as string, {
                                expiresIn: '1h'
                            });

                            res.cookie('accessToken', newAccessToken, {
                                httpOnly: true,
                                // secure: process.env.NODE_ENV === 'production',
                                // sameSite: 'Strict'
                            });

                            (req as CustomRequest).user = newUserPayload;
                            next();
                        });
                    } catch (error) {
                        res.status(500).send({
                            status: 'Error',
                            message: "Error while fetching refresh token."
                        });
                    }
                } else {
                    res.status(403).send({
                        status: 'Forbidden',
                        message: 'Invalid or expired access token.'
                    });
                }
            } else {
                (req as CustomRequest).user = user as UserPayload;
                next();
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: "Internal Server Error."
        });
    }
}
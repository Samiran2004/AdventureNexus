import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../src/models/userModel';

interface UserPayload extends JwtPayload {
    fullname: string;
    email: string;
    username: string;
    gender: string;
    _id: string;
    profilepicture: string;
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies['accessToken'];

        // Check if access token is present
        if (!accessToken) {
            return res.status(401).send({
                status: 'Unauthorized',
                message: "Access token not found."
            });
        }

        // Verify the access token
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, async (err, user) => {
            if (err) {
                // If token has expired, handle it
                if (err.name === 'TokenExpiredError') {
                    try {
                        const userData = await User.findById((user as UserPayload)._id);
                        if (!userData || !userData.refreshtoken) {
                            return res.status(403).send({
                                status: 'Forbidden',
                                message: "Refresh token not found, please login again."
                            });
                        }

                        // Verify the refresh token
                        jwt.verify(userData.refreshtoken, process.env.JWT_REFRESH_SECRET as string, (err, decodedRefreshToken) => {
                            if (err) {
                                return res.status(403).send({
                                    status: 'Forbidden',
                                    message: "Invalid refresh token, please login again."
                                });
                            }

                            // Generate new access token
                            const newUserPayload: UserPayload = {
                                fullname: userData.fullname,
                                email: userData.email,
                                username: userData.username,
                                gender: userData.gender,
                                _id: userData._id,
                                profilepicture: userData.profilepicture
                            };

                            const newAccessToken = jwt.sign(newUserPayload, process.env.JWT_ACCESS_SECRET as string, {
                                expiresIn: '1h'
                            });

                            // Set new access token in cookies
                            res.cookie('accessToken', newAccessToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'Strict'
                            });

                            req.user = decodedRefreshToken; // Proceed with the refresh token
                            next();
                        });
                    } catch (error) {
                        return res.status(500).send({
                            status: 'Error',
                            message: "Error while fetching refresh token."
                        });
                    }
                } else {
                    return res.status(403).send({
                        status: 'Forbidden',
                        message: 'Invalid or expired access token.'
                    });
                }
            } else {
                // Token is valid, proceed with the user
                req.user = user;
                next();
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'Error',
            message: "Internal Server Error."
        });
    }
};

export default authenticateToken;
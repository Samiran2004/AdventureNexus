const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = authenticateToken = (req, res, next) => {
    const tokenValue = req.cookies['accessToken'];
    if (!tokenValue) {
        res.status(401).send({
            status: 'Unauthorized',
            message: "Access token not found."
        });
    } else {
        jwt.verify(tokenValue, process.env.JWT_ACCESS_SECRET, async (err, user) => {
            if (err) {
                //If token has expired, handle the error...
                if (err.name === 'TokenExpiredError') {
                    try {
                        const userData = await User.findById(user._id);
                        if (!userData || !userData.refreshtoken) {
                            res.status(403).send({
                                status: 'Forbidden',
                                message: "Refresh token not found, please login again."
                            });
                        } else {
                            //Verify the refresh token...
                            jwt.verify(userData.refreshtoken, process.env.JWT_REFRESH_SECRET, (err, decodedRefreshToken) => {
                                if (err) {
                                    return res.status(403).send({
                                        status: 'Forbidden',
                                        message: "Invalid refresh token, please login again."
                                    });
                                } else {
                                    //Generate new access token...
                                    const newUserPayload = {
                                        fullname: userData.fullname,
                                        email: userData.email,
                                        username: userData.username,
                                        gender: userData.gender,
                                        _id: userData._id
                                    }
                                    const newAccessToken = jwt.sign(newUserPayload, process.env.JWT_ACCESS_SECRET, {
                                        expiresIn: '1h'
                                    });
                                    res.cookie('accessToken', accessToken, {
                                        httpOnly: true,
                                        secure: process.env.NODE_ENV === 'production',
                                        sameSite: 'Strict'
                                    });
                                    req.user = decodedRefreshToken;
                                    next();
                                }
                            })
                        }
                    } catch (error) {
                        res.status(500).send({
                            status: 'Error',
                            message: "Error while fetching refresh token."
                        })
                    }
                } else {
                    return res.status(403).send({
                        status: 'Forbidden',
                        message: 'Invalid or expired access token.'
                    });
                }
            } else {
                req.user = user;
                next();
            }
        })
    }
}
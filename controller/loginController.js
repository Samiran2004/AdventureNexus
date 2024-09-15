const userDataValidation = require('../utils/joiLoginValidation');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

module.exports = async function loginuser(req, res) {
    try {
        //Fetch all user data from req.body...
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if (!username || !email || !email) {
            res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        } else {
            //Validate user data using JOI...
            const { error } = userDataValidation.validate(req.body);
            if (error) {
                res.status(400).send({
                    status: 'Failed',
                    message: error.details[0].message
                });
            } else {
                //Find the user in database...
                const checkUser = await User.findOne({ username: username, email: email });
                if (checkUser) {
                    //Match password...
                    const matchPassword = await bcryptjs.compare(password, checkUser.password);
                    if (matchPassword) {
                        //Create JWT Token...
                        const userPayload = {
                            fullname: checkUser.fullname,
                            email: checkUser.email,
                            username: checkUser.username,
                            gender: checkUser.gender
                        }
                        //Access token...
                        const accessToken = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
                        //Refresh token...
                        const refreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
                        //Save the refresh token into database for future...
                        checkUser.refreshtoken = refreshToken;
                        await checkUser.save();
                        //Set cookies...
                        res.cookie('refreshtoken', refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'Strict'
                        })
                        res.status(200).send({
                            status: 'Success',
                            accessToken
                        });
                    } else {
                        res.status(401).send({
                            status: 'Failed',
                            message: "Incorrect Password."
                        });
                    }
                } else {
                    res.status(404).send({
                        status: 'Failed',
                        message: "User not found."
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error...",
            error
        });
    };
};
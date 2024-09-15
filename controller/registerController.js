const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const userDataValidation = require('../utils/JoiValidation');
const generateRandomUserName = require('../utils/generateRandomUserName');
const cloudinary = require('../service/cloudinaryService');
const sendMail = require('../service/mailService');
const fs = require('fs');
require('dotenv').config();

module.exports = async function create_new_user(req, res) {
    const { fullname, email, password, phonenumber, gender, preference, country } = req.body;

    try {
        // Check for required fields
        if (!fullname || !email || !password || !phonenumber || !gender || !country) {
            return res.status(400).send({
                status: 'failed',
                message: 'All fields are required'
            });
        }

        // Validate input data
        const { error } = userDataValidation.validate(req.body);
        if (error) {
            return res.status(400).send({
                status: 'failed',
                message: error.details[0].message
            });
        }

        // Check if the user already exists
        const checkUserExist = await User.findOne({
            $or: [{ email: email }, { phonenumber: phonenumber }]
        });

        if (checkUserExist) {
            return res.status(409).send({
                status: 'failed',
                message: 'User already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a random username
        const username = await generateRandomUserName(fullname);

        // Upload profile image to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);  // Remove file from the local storage
        } catch (uploadError) {
            return res.status(500).send({
                status: 'failed',
                message: 'Error uploading profile picture',
                error: uploadError.message
            });
        }

        // Create the new user
        const newUser = new User({
            fullname: fullname,
            email: email,
            phonenumber: phonenumber,
            password: hashedPassword,
            username: username,
            gender: gender,
            preferences: preference,
            country: country,
            profilepicture: uploadImageUrl.url
        });
        await newUser.save();

        // Email data
        const emailData = {
            to: email,
            subject: 'Welcome to AI Travel Planner',
            html: `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to AI Travel Planner</title>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                            .container { width: 100%; padding: 20px; background-color: #f4f4f4; }
                            .content { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                            h1 { color: #333333; }
                            p { color: #666666; }
                            .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; }
                            .footer { text-align: center; margin-top: 20px; color: #999999; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="content">
                                <h1>Welcome to AI Travel Planner!</h1>
                                <p>Dear ${fullname},</p>
                                <p>Thank you for signing up for AI Travel Planner. We are excited to help you plan your next adventure.</p>
                                <p>With AI Travel Planner, you can effortlessly discover, customize, and manage trips to your dream destinations.</p>
                                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                                <p>Best regards,</p>
                                <p>The AI Travel Planner Team</p>
                                <a href="https://yourtravelplanner.com" class="button">Plan Your Next Trip</a>
                                <div class="footer">
                                    <p>&copy; 2024 AI Travel Planner. All rights reserved.</p>
                                    <p>123 Travel Street, ExploreCity, TC 54321</p>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>`
        };

        // Send welcome email
        sendMail(emailData, (mailError,response) => {
            if (mailError) {
                return res.status(500).send({
                    status: 'failed',
                    message: 'User created, but email sending failed'
                });
            }

            res.status(201).send({
                status: 'success',
                message: 'User created successfully',
                userdata: {
                    fullname: newUser.fullname,
                    email: newUser.email,
                    phonenumber: newUser.phonenumber,
                    username: newUser.username,
                    gender: newUser.gender,
                    preference: newUser.preferences,
                    country: newUser.country,
                    profilepicture: newUser.profilepicture
                }
            });
        });
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
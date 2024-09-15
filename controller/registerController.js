const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const userDataValidation = require('../utils/JoiValidation');
const generateRandomUserName = require('../utils/generateRandomUserName');
const cloudinary = require('../service/cloudinaryService');
const sendMail = require('../service/mailService');
const fs = require('fs');
const { registerEmailData } = require('../utils/emailTemplate');
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
        const emailData = registerEmailData(fullname, email);

        // Send welcome email
        sendMail(emailData, (mailError, response) => {
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
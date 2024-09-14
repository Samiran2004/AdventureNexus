const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const userDataValidation = require('../utils/JoiValidation');
const generateRandomUserName = require('../utils/generateRandomUserName');
const cloudinary = require('../service/cloudinaryService');
const fs = require('fs');

require('dotenv').config();

module.exports = async function create_new_user(req, res) {
    //Fetch all data from request...
    const { fullname, email, password, phonenumber, gender, preference, country } = req.body;
    try {
        if (!fullname || !email || !password || !phonenumber || !gender || !country) {
            res.status(400).send({
                status: 'failed',
                message: 'All fields are required'
            })
        }
        // Validate input data
        const { error } = userDataValidation.validate(req.body);
        if (error) {
            res.status(400).send({
                status: 'failed',
                message: error.details[0].message
            })
        } else {
            //Check user is already exist or not...
            const checkUserExist = await User.findOne({
                $or: [{ email: email }, { phonenumber: phonenumber }]
            })
            if (checkUserExist) {
                res.status(409).send({
                    status: 'failed',
                    message: "User already exists"
                })
            } else {
                //Generate Salt for hashing...
                const salt = await bcrypt.genSalt(10);
                //Generate Hashed Password...
                const hashedPassword = await bcrypt.hash(password, salt);
                //Generate a random username...
                const username = await generateRandomUserName(fullname);
                // console.log(req.file.path);
                //Upload the profileimage file on cloudinary...
                const uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
                // console.log(uploadImageUrl);
                //Remove the profieimege file from system storage...
                fs.unlinkSync(req.file.path);
                //Create new user...
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
                res.status(201).send({
                    status: 'success',
                    message: `User created successfully`,
                    userdata: {
                        fullname: newUser.fullname, email: newUser.email, phonenumber: newUser.phonenumber, username: newUser.username, gender: newUser.gender, preference: newUser.preferences, country: newUser.country, profilepicture: newUser.profilepicture
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            message: 'Internal Server Error',
            error
        });
    }
}
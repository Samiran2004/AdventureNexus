const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const userDataValidation = require('../utils/JoiValidation');
const generateRandomUserName = require('../utils/generateRandomUserName');

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
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const username = await generateRandomUserName(fullname);
                
                const newUser = new User({
                    fullname: fullname,
                    email: email,
                    phonenumber: phonenumber,
                    password: hashedPassword,
                    username: username,
                    gender: gender,
                    preferences: preference,
                    country: country
                });
                await newUser.save();
                res.status(201).send({
                    status:'success',
                    message: `User created successfully`
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
}

// module.exports = create_new_user;
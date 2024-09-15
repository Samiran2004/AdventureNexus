const User = require('../models/userModel');
const generateRandomUserName = require('../utils/generateRandomUserName');

module.exports = updateProfile = async (req, res) => {
    try {
        //Fetch the user using id...
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }
        const { fullname, gender, preference, country } = req.body;
        if (!fullname && !gender && !preference && !country) {
            return res.status(400).send({
                status: 'Failed',
                message: "Please provide at least one field to update."
            })
        }
        if (fullname) {
            checkUser.fullname = fullname;
            const username = generateRandomUserName(fullname);
            checkUser.username = username;
        }
        if (gender) {
            checkUser.gender = gender;
        }
        if (preference) {
            checkUser.preferences = preference;
        }
        if (country) {
            checkUser.country = country;
        }
        await checkUser.save();
        res.status(201).send({
            status: 'Success',
            message: "User updated.",
            userData: {
                fullname: checkUser.fullname,
                username: checkUser.username,
                email: checkUser.email,
                phonenumber: checkUser.phonenumber,
                gender: checkUser.gender,
                preference: checkUser.preferences,
                country: checkUser.country,
                _id: checkUser._id
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
}
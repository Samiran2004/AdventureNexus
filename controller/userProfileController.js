const User = require('../models/userModel');

async function userProfile(req, res) {
    try {
        const userData = await User.findById(req.user._id);
        if (!userData) {
            res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        } else {
            res.status(200).send({
                status: 'Success',
                userData: {
                    fullname: userData.fullname,
                    email: userData.email,
                    phonenumber: userData.phonenumber,
                    username: userData.username,
                    gender: userData.gender,
                    profilepicture: userData.profilepicture,
                    preference: userData.preferences,
                    country: userData.country
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        })
    }
}
module.exports = userProfile
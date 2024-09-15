const cloudinary = require('../service/cloudinaryService');
const User = require('../models/userModel');
const sendMail = require('../service/mailService');
const { deleteUserEmailData } = require('../utils/emailTemplate');

module.exports = async function userDelete(req, res) {
    try {
        // Check if the user already exists
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            res.status(404).send({
                status: 'Failed',
                message: "Not a valid user."
            });
        } else {
            //Delete profile picture from cloudinary...
            const profilePictureUrl = checkUser.profilepicture;
            const publicId = profilePictureUrl.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Error deleting profile picture from Cloudinary",
                    error
                });
            }
            //Delete user from database...
            await User.findByIdAndDelete(req.user._id);
            //Send a mail...
            const emailData = deleteUserEmailData(req.user.fullname, req.user.email);
            await sendMail(emailData, (error, response) => {
                if (error) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: "User deleted, but email sending failed"
                    });
                }
                res.status(200).send({
                    status: 'Success',
                    message: "User deleted."
                });
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
}
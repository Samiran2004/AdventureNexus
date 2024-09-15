const cloudinary = require('../service/cloudinaryService');
const User = require('../models/userModel');
const sendMail = require('../service/mailService');

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
            const emailData = {
                to: req.user.email, // Recipient's email address
                subject: "Account Deletion Confirmation - AI Travel Planner",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Deletion - AI Travel Planner</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .content {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333333;
                        }
                        p {
                            color: #666666;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #999999;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <h1>Account Deletion Confirmation</h1>
                            <p>Dear ${req.user.fullname},</p>
                            <p>We’re sorry to inform you that your account with AI Travel Planner has been successfully deleted.</p>
                            <p>If this was a mistake or if you’d like to rejoin our community, feel free to contact us, and we’ll be happy to assist you with account recovery or creating a new account.</p>
                            <p>Thank you for using AI Travel Planner. We hope to see you again soon!</p>
                            <p>Best regards,</p>
                            <p>The AI Travel Planner Team</p>
                            <div class="footer">
                                <p>&copy; 2024 AI Travel Planner. All rights reserved.</p>
                                <p>123 Travel Street, ExploreCity, TC 54321</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                `
            };
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailTemplates = {
    registerEmailData: (fullname, email) => {
        return {
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
                </html>`,
        };
    },
    deleteUserEmailData: (fullname, email) => {
        return {
            to: email,
            subject: 'Account Deletion Confirmation - AI Travel Planner',
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
                            <p>Dear ${fullname},</p>
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
                </html>`,
        };
    },
};
exports.default = emailTemplates;

export interface EmailData {
    to: string;
    subject: string;
    html: string;
}

interface EmailTemplates {
    registerEmailData: (fullname: string, email: string) => EmailData;
    deleteUserEmailData: (fullname: string, email: string) => EmailData;
    subscribeDailyMailEmailData: (email: string)=> EmailData;
}

const emailTemplates: EmailTemplates = {
    registerEmailData: (fullname: string, email: string): EmailData => {
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
    deleteUserEmailData: (fullname: string, email: string): EmailData => {
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

    subscribeDailyMailEmailData: (email: string)=>{
        return {
            to: email,
            subject: 'Welcome Aboard! 🌍 Your Daily Travel Tips Subscription',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Subscription Confirmed - AI Travel Planner</title>
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
                            line-height: 1.6;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #999999;
                            font-size: 12px;
                        }
                        .footer a {
                            color: #999999;
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <h1>Subscription Confirmed! ✈️</h1>
                            <p><strong>Welcome to the AI Travel Planner community!</strong></p>
                            <p>You have successfully subscribed to our Daily Travel Tips. Get ready to explore the world smarter, cheaper, and more efficiently.</p>
                            <p>Starting tomorrow, you will receive a daily dose of travel hacks, hidden gem destinations, and expert packing advice directly to your inbox.</p>
                            <p>We can't wait to help you plan your next adventure!</p>
                            <p>Happy Travels,</p>
                            <p>The AI Travel Planner Team</p>
                            <div class="footer">
                                <p>&copy; 2024 AI Travel Planner. All rights reserved.</p>
                                <p>123 Travel Street, ExploreCity, TC 54321</p>
                                <p>Don't want these tips anymore? <a href="#">Unsubscribe here</a>.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`,
        };
    }
};

export default emailTemplates;

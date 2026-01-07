/**
 * Interface representing the structure of email data to be sent.
 */
export interface EmailData {
    to: string;       // Recipient's email address
    subject: string;  // Email subject line
    html: string;     // HTML content of the email
}

/**
 * Interface defining the contract for the emailTemplates object.
 * Each method returns an EmailData object ready for sending.
 */
interface EmailTemplates {
    registerEmailData: (fullname: string, email: string) => EmailData;
    deleteUserEmailData: (fullname: string, email: string) => EmailData;
    subscribeDailyMailEmailData: (email: string) => EmailData;
    sendDailyTipEmailData: (email: string, tipData: string) => EmailData; // tipData is currently 'any' or specific type
}

/**
 * Object containing various HTML email templates for the application.
 */
const emailTemplates: EmailTemplates = {
    // ... Methods implemented below
    /**
     * Generates email data for user registration.
     * Contains a welcome message and a link to start planning.
     * @param fullname - Full name of the user.
     * @param email - Email address of the user.
     * @returns EmailData object.
     */
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

    /**
     * Generates email data for user account deletion.
     * Confirms the action and offers support if it was a mistake.
     * @param fullname - Full name of the user.
     * @param email - Email address of the user.
     * @returns EmailData object.
     */
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

    /**
     * Generates email data for confirming a subscription to the daily newsletter.
     * @param email - Subscriber's email address.
     * @returns EmailData object.
     */
    subscribeDailyMailEmailData: (email: string) => {
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
    },

    /**
     * Generates email data for the daily travel tip.
     * Uses dynamic colors and content based on the tip category.
     * @param email - Recipient's email.
     * @param tipData - Object containing headline, category, advice, location, etc.
     * @returns EmailData object.
     */
    sendDailyTipEmailData: (email, tipData) => {
        // Get current date for the header
        const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        // Map categories to colors/emojis (Optional visual flair)
        const categoryColors = {
            "Alert": "#ef4444",      // Red
            "Safety": "#ef4444",     // Red
            "Hidden Gem": "#8b5cf6", // Purple
            "Culture": "#f59e0b",    // Amber
            "Savings": "#10b981",    // Green
            "Event": "#3b82f6",      // Blue
        };

        const accentColor = categoryColors[tipData.category] || "#3b82f6";

        return {
            to: email,
            // Dynamic subject line increases open rates
            subject: `🌍 Daily Brief: ${tipData.headline}`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Daily Travel Brief - AdventureNexus</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        -webkit-font-smoothing: antialiased;
                    }
                    .container {
                        width: 100%;
                        padding: 20px 0;
                        background-color: #f4f4f4;
                    }
                    .content {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    }
                    .header {
                        background: linear-gradient(135deg, #1e3a8a 0%, #000000 100%);
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                        letter-spacing: 1px;
                    }
                    .date-badge {
                        background-color: rgba(255, 255, 255, 0.2);
                        color: #ffffff;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 12px;
                        display: inline-block;
                        margin-top: 10px;
                    }
                    .body-content {
                        padding: 30px;
                    }
                    .tip-card {
                        background-color: #f8fafc;
                        border-left: 5px solid ${accentColor};
                        padding: 20px;
                        border-radius: 4px;
                        margin-bottom: 25px;
                    }
                    .category-tag {
                        color: ${accentColor};
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 12px;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                        display: block;
                    }
                    h2 {
                        color: #1f2937;
                        margin-top: 0;
                        font-size: 20px;
                        line-height: 1.4;
                    }
                    p {
                        color: #4b5563;
                        line-height: 1.6;
                        font-size: 16px;
                    }
                    .cta-button {
                        display: block;
                        width: 100%;
                        text-align: center;
                        background-color: #2563eb;
                        color: #ffffff;
                        padding: 15px 0;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .cta-button:hover {
                        background-color: #1d4ed8;
                    }
                    .footer {
                        background-color: #f9fafb;
                        padding: 20px;
                        text-align: center;
                        color: #9ca3af;
                        font-size: 12px;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer a {
                        color: #6b7280;
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <!-- Header Section -->
                        <div class="header">
                            <h1>AdventureNexus</h1>
                            <div class="date-badge">${date}</div>
                        </div>

                        <!-- Main Body -->
                        <div class="body-content">
                            <p>Hi Traveler,</p>
                            <p>Here is your daily insight for <strong>${tipData.location}</strong>.</p>
                            
                            <!-- The Main Tip Card -->
                            <div class="tip-card">
                                <span class="category-tag">● ${tipData.category || tipData.theme}</span>
                                <h2>${tipData.headline}</h2>
                                <p>${tipData.advice || tipData.actionable_update}</p>
                                
                                <!-- Optional: Show local insight if available -->
                                ${tipData.local_insight ? `<p style="font-style: italic; font-size: 14px; margin-top: 15px; color: #666;">💡 <strong>Local Secret:</strong> ${tipData.local_insight}</p>` : ''}
                            </div>

                            <p>Planning a trip to ${tipData.location}? Check our full guide for real-time updates.</p>

                            <a href="https://your-website.com/location/${encodeURIComponent(tipData.location)}" class="cta-button">
                                Plan Trip to ${tipData.location}
                            </a>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} AdventureNexus. All rights reserved.</p>
                            <p>You received this email because you subscribed to daily updates for ${tipData.location}.</p>
                            <p><a href="#">Manage Preferences</a> | <a href="#">Unsubscribe</a></p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`,
        };
    }

};

export default emailTemplates;

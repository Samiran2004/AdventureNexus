const nodemailer = require('nodemailer');

const sendMail = async (data, callback) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: data.to,
        subject: data.subject,
        html: data.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, info.response);
        }
    });
}

module.exports = sendMail;
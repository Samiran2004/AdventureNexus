import nodemailer from 'nodemailer';

interface MailData {
    to: string;
    subject: string;
    html: string;
}

const sendMail = async (data: MailData, callback: (error: Error | null, response?: string) => void) => {
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

export default sendMail;

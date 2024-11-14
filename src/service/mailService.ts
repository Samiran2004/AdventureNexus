import nodemailer from 'nodemailer';
import { config } from '../config/config';

interface MailData {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (
  data: MailData,
  callback: (error: Error | null, response: string | null) => void
) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.MAIL_ADDRESS,
      pass: config.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.MAIL_ADDRESS,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info.response);
    }
  });
};

export default sendMail;

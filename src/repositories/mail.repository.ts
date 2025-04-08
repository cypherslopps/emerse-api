import nodemailer from "nodemailer";
import config from "../config/mail";
import { MailDTO } from "../dto/mail.dto";

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: true,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
});

class MailRepository {
    async sendEmail(payload: MailDTO) {
        const mailOptions = {
            from: config.SMTP_USER
        };
        
        // Map payload to mail options
        Object.entries(payload).map(([key, value]) => {
            mailOptions[key] = value;
        });

        return transporter.sendMail(mailOptions)
    }
}

export default MailRepository;
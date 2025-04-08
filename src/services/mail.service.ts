import { UserDTO } from "../dto/users/user.dto";
import MailRepository from "../repositories/mail.repository";

class MailService {
    private _mailRepository: MailRepository;

    constructor() {
        this._mailRepository = new MailRepository();
    }
    
    async sendVerifyMail(userMail: UserDTO["email"], payload: { token: string }) {
        return this._mailRepository.sendEmail({
            to: userMail,
            subject: "Verify your mail",
            text: payload.token
        });
    }

    async sendResetPasswordLink(userMail: UserDTO["email"]) {
        return this._mailRepository.sendEmail({
            to: userMail,
            subject: "",
            html: ""
        });
    }
}

export default MailService;
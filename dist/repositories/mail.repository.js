"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("../config/mail"));
const transporter = nodemailer_1.default.createTransport({
    host: mail_1.default.SMTP_HOST,
    port: mail_1.default.SMTP_PORT,
    secure: true,
    auth: {
        user: mail_1.default.SMTP_USER,
        pass: mail_1.default.SMTP_PASS
    }
});
class MailRepository {
    sendEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: mail_1.default.SMTP_USER
            };
            // Map payload to mail options
            Object.entries(payload).map(([key, value]) => {
                mailOptions[key] = value;
            });
            return transporter.sendMail(mailOptions);
        });
    }
}
exports.default = MailRepository;
//# sourceMappingURL=mail.repository.js.map
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
const mail_repository_1 = __importDefault(require("../repositories/mail.repository"));
class MailService {
    constructor() {
        this._mailRepository = new mail_repository_1.default();
    }
    sendVerifyMail(userMail, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._mailRepository.sendEmail({
                to: userMail,
                subject: "Verify your mail",
                text: payload.token
            });
        });
    }
    sendResetPasswordLink(userMail) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._mailRepository.sendEmail({
                to: userMail,
                subject: "",
                html: ""
            });
        });
    }
}
exports.default = MailService;
//# sourceMappingURL=mail.service.js.map
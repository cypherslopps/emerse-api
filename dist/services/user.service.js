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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_service_1 = __importDefault(require("./mail.service"));
class UserService {
    constructor() {
        this._userRepository = new user_repository_1.default();
        this._mailService = new mail_service_1.default();
    }
    /**
     * @dev This method checks if a user exists. Returns either the user or (null | throw an error)
     * @param email
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            return user;
        });
    }
    /**
     * @dev This method checks if a user exists. Returns either the user or (null | throw an error)
     * @param id
     */
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(id);
            return user;
        });
    }
    /**
     * @dev Send verify mail token
     * @param email
     */
    sendVerificationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create verify mail token
            const verifyMailToken = yield jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_VERIFY_MAIL_TOKEN, { expiresIn: "10m" });
            // Send user mail
            this._mailService.sendVerifyMail(email, {
                token: verifyMailToken
            });
        });
    }
    /**
     * @dev Creates a user if user doesn't exist
     * @param email
     * @param username
     * @param password
     */
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const user = yield this._userRepository.findByEmail(data.email);
            // Throw an error if user exists
            if (user) {
                throw new Error("User already exists");
            }
            // Hash password if user doesn't exist
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const newUser = Object.assign(Object.assign({}, data), { password: hashedPassword });
            // Store user in database
            this._userRepository.create(newUser);
            // Send verification code
            yield this.sendVerificationCode(data.email);
            return true;
        });
    }
    /**
     * @dev Login user service
     * @param email
     * @param password
     */
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            const user = yield this._userRepository.findByEmail(data.email);
            if (!user.valid) {
                throw new Error("User is unverified");
            }
            // Throw error if user doesn't exists
            if (!user) {
                throw new Error("User not found");
            }
            // Compare payload password to hashed password
            const isPasswordEquallyMatched = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordEquallyMatched) {
                throw new Error("Invalid Credentials");
            }
            // Create access token & Session
            const userInfo = {
                userId: user.id,
                role: user.role
            };
            const token = yield jsonwebtoken_1.default.sign(userInfo, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1w" });
            const refreshToken = yield jsonwebtoken_1.default.sign(userInfo, process.env.JWT_ACCESS_TOKEN);
            return { token, refreshToken };
        });
    }
    /**
     * @dev Verifies user mail
     * @payload token
     */
    verifyUserMail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_VERIFY_MAIL_TOKEN);
            if (!userData) {
                throw new Error("Invalid Token");
            }
            // Check user
            const user = yield this._userRepository.findByEmail(userData.email);
            if (!user) {
                throw new Error("User not found");
            }
            // Validate user
            this._userRepository.validateUser(userData.email);
        });
    }
    /**
     * @dev Resnd user verification code
     * @param email
     */
    resendVerificationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check user
            const user = yield this._userRepository.findByEmail(email);
            // Throw an error if user doesn't exist
            if (!user) {
                throw new Error("User not found");
            }
            // Throw an error if user is already verified
            if (user.valid) {
                throw new Error("User is already validated");
            }
            // Send verification code
            yield this.sendVerificationCode(email);
        });
    }
    /**
     * @dev Update user password
     * @param userId - UserDTO["id"]
     * @param oldPassword - UserDTO["password"]
     * @param newPassword - UserDTO["password"]
     */
    updateUserPassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._userRepository.updatePassword(userId, newPassword);
            return "Password successfully updated";
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map
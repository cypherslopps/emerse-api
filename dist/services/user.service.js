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
     * @dev Find all users
     */
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this._userRepository.findAll();
            return users;
        });
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
     * @dev Find user by Google ID
     * @param google_id
     */
    findUserByGoogleID(google_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByGoogleID(google_id);
            ;
            return user;
        });
    }
    /**
     * @dev Check if user exists
     * @param email
     */
    checksUserAvailability(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            const user = yield this._userRepository.findByEmail(email);
            // Throw error if user doesn't exists
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    /**
     * @dev Send verify mail token
     * @param email
     */
    sendCodeToMail(email, secretKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const secretToken = secretKey !== null && secretKey !== void 0 ? secretKey : process.env.JWT_VERIFY_MAIL_TOKEN;
                // Create verify mail token
                const verifyMailToken = yield jsonwebtoken_1.default.sign({ email: email }, secretToken, { expiresIn: "10m" });
                // Send user mail
                this._mailService.sendVerifyMail(email, {
                    token: verifyMailToken
                });
            }
            catch (error) {
                throw new Error((error === null || error === void 0 ? void 0 : error.message) || "An error occured");
            }
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
            // New user payload
            const newUser = Object.assign(Object.assign({}, data), { password: hashedPassword });
            // Store user in database
            this._userRepository.create(newUser);
            // Send verification code
            yield this.sendCodeToMail(data.email);
            return true;
        });
    }
    /**
     * @dev Register OAuth user
     * @param google_id - Unique user Google ID
     * @param email - user email
     * @param displayName
     * @param email_verified
     */
    registerAuthUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check user
            const doesGoogleIDExist = yield this._userRepository.findByGoogleID(data.google_id);
            const doesUserEmailExist = yield this._userRepository.findByEmail(data.email);
            if (doesGoogleIDExist || doesUserEmailExist) {
                throw new Error("User already exists");
            }
            // Create User
            this._userRepository.createAuth(data);
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
            const user = yield this.checksUserAvailability(data.email);
            if (!user.valid) {
                throw new Error("User is unverified");
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
     * @dev Send user reset password token to mail
     * @param email
     */
    sendResetPasswordToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            yield this.checksUserAvailability(email);
            // Send Code
            yield this.sendCodeToMail(email, process.env.JWT_RESET_PASSWORD_TOKEN);
            return true;
        });
    }
    /**
     * @dev Reset user password
     * @param email
     * @param token
     * @param newPassword
     */
    resetUserPassword(email, token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            const user = yield this.checksUserAvailability(email);
            // Verify token
            const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_PASSWORD_TOKEN);
            // Handle error if token is invalid
            if (!verifiedToken) {
                throw new Error("Invalid token");
            }
            // Compare both passwords
            const isEquallyMatched = yield bcrypt_1.default.compare(user.password, newPassword);
            if (isEquallyMatched) {
                throw new Error("Use a different password");
            }
            // Hash new password
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            // Update password
            this._userRepository.updatePassword(user.id, hashedPassword);
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
            const user = yield this.checksUserAvailability(userData.email);
            // Validate user
            this._userRepository.validateUser(user.email);
        });
    }
    /**
     * @dev Resnd user verification code
     * @param email
     */
    resendVerificationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check user
            const user = yield this.checksUserAvailability(email);
            // Throw an error if user is already verified
            if (user.valid) {
                throw new Error("User is already validated");
            }
            // Send verification code
            yield this.sendCodeToMail(email);
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map
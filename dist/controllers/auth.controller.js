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
exports.resendVerificationCode = exports.verifyUserMail = exports.logout = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
// User Service
const userService = new user_service_1.default();
/**
 * #dev registerUser controller create a new user if user doesn't already exist
 * @payload { email, username, password }
 */
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, role, password } = req.body;
    try {
        if (email && username && password) {
            // Create user
            yield userService.register({
                email,
                username,
                role: role !== null && role !== void 0 ? role : "customer",
                password
            });
            res.status(201).json({
                status: true,
                message: "Successfully added user"
            });
        }
        else {
            throw new Error("Check payloads");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
/**
 * @dev loginUser controller signs in user.
 * @payload { username, password }
 */
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const { token, refreshToken } = yield userService.login({
                email,
                password
            });
            res.cookie("jwt", token, {
                maxAge: 60 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });
            // Send successful message & code
            res.status(200).json({
                status: true,
                accessToken: token,
                refreshToken
            });
        }
        else {
            throw new Error("Check payloads");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
/**
 * @dev Verifies user email after successful registration
 * @param token - Unique token sent to mail
 * @param email - User email
 */
const verifyUserMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        if (code) {
            yield userService.verifyUserMail(code);
            res.status(200).json({
                status: true,
                message: "Verification complete"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyUserMail = verifyUserMail;
/**
 * @dev Resend verification token after it expires
 * @param email - User email
 */
const resendVerificationCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (email) {
            yield userService.resendVerificationCode(email);
            res.status(200).json({
                status: true,
                message: "Verification code resent successfully"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.resendVerificationCode = resendVerificationCode;
/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email
 */
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (email) {
            yield userService.sendResetPasswordToken(email);
            res.status(200).json({
                status: true,
                message: "Token sent to user mail"
            });
        }
        else {
            res.status(409).json({ message: "Check email payload" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email - User email
 * @param token - Valid token for verification
 * @param newPassword - New password
 */
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email, newPassword } = req.body;
    try {
        yield userService.resetUserPassword(email, token, newPassword);
        res.status(200).json({
            status: true,
            message: "Password successfully reset"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
/**
 * @dev logs out user. Only authorized user can log out
 */
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
            req.logout();
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Could not log out');
                }
                // res.clearCookie('connect.sid');
                // res.redirect('/login'); // Redirect to home or login page
                const googleLogoutUrl = 'https://accounts.google.com/logout';
                res.redirect(googleLogoutUrl);
            });
            res.clearCookie("jwt");
            res.setHeader("Location", "/auth/login");
            res.status(200).json({
                status: true,
                message: "Logged out successfully"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map
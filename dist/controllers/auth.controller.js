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
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../services/user.service"));
const userService = new user_service_1.default();
/**
 * #dev registerUser controller create a new user if user doesn't already exist
 * @payload { email, username, password }
 */
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, username, password } = req.body;
    try {
        if (email && username && password) {
            // Check if user already exists
            const user = yield userService.findUserByEmail(email);
            // Throw an error if user exists
            if (user) {
                res.status(400).json({ message: "User already exists" });
            }
            // Create new user
            const response = yield userService.createUser({
                email,
                username,
                password
            });
            res.status(201).json({ message: response });
        }
        else {
            res.status(409).send("Check payloads");
        }
    }
    catch (err) {
        res.status(500).json({ message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "An error occured" });
    }
}));
exports.registerUser = registerUser;
/**
 * @dev loginUser controller signs in user.
 * @payload { username, password }
 */
const loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (email && password) {
            // Check if user exists
            const user = yield userService.findUserByEmail(email);
            // Throw error if user doesn't exists
            if (!user) {
                res.status(404).json({ message: "User does not exist!" });
            }
            // Compare payload password to hashed password
            const isPasswordEquallyMatched = yield userService.comparePassword(user.password, password);
            if (!isPasswordEquallyMatched) {
                res.status(400).json({
                    message: "Invalid Credentials"
                });
            }
            // Create access token & Session
            const token = yield jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1w" });
            const refreshToken = yield jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN);
            res.cookie("jwt", token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });
            // Send successful message & code
            res.status(200).json({ token, refreshToken });
        }
        else {
            res.status(409).send("Check payloads");
        }
    }
    catch (err) {
        res.status(500).json({ message: (err === null || err === void 0 ? void 0 : err.message) || "An error occured" });
    }
}));
exports.loginUser = loginUser;
/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email
 */
const forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.body;
    try {
        if (email) {
            // Check if user exists
            const user = yield userService.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User does not exist" });
            }
            // Create token
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "15m" });
            res.cookie("access_fk", token, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });
            res.status(200).json({
                message: `${process.env.FRONTEND_URL}?token=${token}&email=${user.email}`
            });
        }
        else {
            res.status(409).json({ message: "Check email payload" });
        }
    }
    catch (err) {
        res.status(500).json({ message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "An error occured" });
    }
}));
exports.forgotPassword = forgotPassword;
/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email - User email
 * @param token - Valid token for verification
 * @param newPassword - New password
 */
const resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { token, email, newPassword } = req.body;
    try {
        if (email && token && newPassword) {
            // Check if user exists
            const user = yield userService.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User does not exist" });
            }
            // Verify token
            const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_TOKEN);
            // Handle error if token is invalid
            if (!verifiedToken) {
                res.status(401).json({ message: "Invalid token" });
            }
            // Compare both passwords
            const isEquallyMatched = yield userService.comparePassword(user.password, newPassword);
            if (isEquallyMatched) {
                res.status(409).json({
                    message: "Use a different password"
                });
            }
            // Hash new password
            const hashedPassword = yield userService.hashPassword(newPassword);
            // Update password
            const response = yield userService.updateUserPassword(user.id, hashedPassword);
            res.status(200).json({
                message: response
            });
        }
        else {
            res.status(409).json({ message: "Check payload" });
        }
    }
    catch (err) {
        res.status(500).json({ message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "An error occured" });
    }
}));
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map
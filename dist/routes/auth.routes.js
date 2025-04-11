"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
// Auth Controllers
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = express_1.default.Router();
authRouter.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"]
}));
authRouter.get("/google/callback", passport_1.default.authenticate("google", {
    succussRedirect: "/api/auth/google/success",
    failureRedirect: "/api/auth/google/failure"
}), (req, res) => {
    const user = req.user;
    // Set access token in cookie
    res.cookie("jwt", user === null || user === void 0 ? void 0 : user.accessToken, {
        maxAge: 60 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });
    res.status(200).json({
        status: true,
        accessToken: user === null || user === void 0 ? void 0 : user.accessToken,
        refreshToken: user === null || user === void 0 ? void 0 : user.refreshToken
    });
});
authRouter.get("/google/success", (req, res) => {
    res.json({ message: "Successful" });
});
authRouter.get("/google/failure", (req, res) => {
    res.json({ message: "Failure" });
});
/**
 * @dev Registers new user
 * @param CreateNewUserDTO
 */
authRouter.post("/register", auth_controller_1.registerUser);
/**
 * @dev Login user
 * @param LoginUserDTO
 */
authRouter.post("/login", auth_controller_1.loginUser);
/**
 * @dev Verify user
 * @param token
 */
authRouter.post("/verify-mail", auth_controller_1.verifyUserMail);
/**
 * @dev Resend verification code
 * @param email
 */
authRouter.post("/resend-verify-code", auth_controller_1.resendVerificationCode);
/**
 * @dev Forgot password
 * @param email
 */
authRouter.post("/forgot-password", auth_controller_1.forgotPassword);
/**
 * @dev Reset Password
 * @param token
 * @param email
 * @param newPassword
 */
authRouter.put("/reset-password", auth_controller_1.resetPassword);
/**
 * @dev Logout user
 */
authRouter.post('/logout', auth_middleware_1.authenticate, auth_controller_1.logout);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map
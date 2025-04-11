import express from "express";

import passport from "../config/passport";

// Auth Controllers
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logout,
    verifyUserMail,
    resendVerificationCode
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.get(
    "/google",     
    passport.authenticate("google", {
        scope: ["email", "profile"]
    })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        succussRedirect: "/api/auth/google/success",
        failureRedirect: "/api/auth/google/failure"
    }),
    (req, res) => {
        const user = (req as any).user;
        
        // Set access token in cookie
        res.cookie("jwt", user?.accessToken, {
            maxAge: 60 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        res.status(200).json({
            status: true,
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken
        })
    }
)

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
authRouter.post("/register", registerUser);

/**
 * @dev Login user
 * @param LoginUserDTO
 */
authRouter.post("/login", loginUser);

/**
 * @dev Verify user
 * @param token
 */
authRouter.post("/verify-mail", verifyUserMail);

/**
 * @dev Resend verification code
 * @param email
 */
authRouter.post("/resend-verify-code", resendVerificationCode);

/**
 * @dev Forgot password
 * @param email
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * @dev Reset Password
 * @param token
 * @param email
 * @param newPassword
 */
authRouter.put("/reset-password", resetPassword);

/**
 * @dev Logout user
 */
authRouter.post('/logout', authenticate, logout);

export default authRouter;
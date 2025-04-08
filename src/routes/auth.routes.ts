import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

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

/**
 * @dev Passport Google OAuth 2.0
 */
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:8000/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(accessToken, refreshToken, profile, cb)
    }
));

authRouter.get(
    "/google",     
    passport.authenticate("google", {
        scope: ["email", "profile"]
    })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        access_type: "offline",
        scope: ["email", "profile"]
    }),
    (req, res) => {
        // if (!re)
        console.log((req as any).user);
    }
)

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
authRouter.post("/reset-password", resetPassword);

/**
 * @dev Logout user
 */
authRouter.post('/logout', authenticate, logout);


export default authRouter;
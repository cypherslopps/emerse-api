import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Auth Controllers
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller";

const router = express.Router();

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

router.get(
    "/google",     
    passport.authenticate("google", {
        scope: ["email", "profile"]
    })
);

router.get(
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
router.post("/register", registerUser);

/**
 * @dev Login user
 * @param LoginUserDTO
 */
router.post("/login", loginUser);

/**
 * @dev Forgot password
 * @param email
 */
router.post("/forgot-password", forgotPassword);

/**
 * @dev Reset Password
 * @param token
 * @param email
 * @param newPassword
 */
router.post("/reset-password", resetPassword);

export default router;
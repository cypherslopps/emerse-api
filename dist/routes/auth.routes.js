"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
// Auth Controllers
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
/**
 * @dev Passport Google OAuth 2.0
 */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:8000/auth/google/callback`
}, function (accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile, cb);
}));
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"]
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    access_type: "offline",
    scope: ["email", "profile"]
}), (req, res) => {
    // if (!re)
    console.log(req.user);
});
/**
 * @dev Registers new user
 * @param CreateNewUserDTO
 */
router.post("/register", auth_controller_1.registerUser);
/**
 * @dev Login user
 * @param LoginUserDTO
 */
router.post("/login", auth_controller_1.loginUser);
/**
 * @dev Forgot password
 * @param email
 */
router.post("/forgot-password", auth_controller_1.forgotPassword);
/**
 * @dev Reset Password
 * @param token
 * @param email
 * @param newPassword
 */
router.post("/reset-password", auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
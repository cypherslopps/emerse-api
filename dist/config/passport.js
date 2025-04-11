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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_service_1 = __importDefault(require("../services/user.service"));
const userService = new user_service_1.default();
/**
 * @dev Passport Google OAuth 2.0
 */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!profile || !profile.emails || !profile.emails[0]) {
            throw new Error("Failed to fetch user profile");
        }
        const newUser = {
            google_id: profile === null || profile === void 0 ? void 0 : profile.id,
            displayName: profile === null || profile === void 0 ? void 0 : profile.displayName,
            email: profile === null || profile === void 0 ? void 0 : profile.emails[0].value,
            email_verified: (profile === null || profile === void 0 ? void 0 : profile.email_verified) || true
        };
        if (!newUser.google_id || !newUser.email) {
            throw new Error("Invalid user data");
        }
        // Check if user exists
        const doesUserExist = yield userService.findUserByGoogleID(newUser.google_id);
        // Return user data and authenticated token if user exists;
        if (doesUserExist) {
            return done(null, Object.assign(Object.assign({}, doesUserExist), { accessToken,
                refreshToken }));
        }
        // Create auth user if does not exist
        yield userService.registerAuthUser(newUser);
        return done(null, Object.assign(Object.assign({}, newUser), { accessToken, refreshToken }));
    }
    catch (err) {
        console.log("An error occured during authentication: ", err === null || err === void 0 ? void 0 : err.message);
        return done(err, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map
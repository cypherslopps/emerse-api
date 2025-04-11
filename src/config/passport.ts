import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../services/user.service";

const userService = new UserService();

/**
 * @dev Passport Google OAuth 2.0
 */
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", 
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            if (!profile || !profile.emails || !profile.emails[0]) {
                throw new Error("Failed to fetch user profile");
            }

            const newUser = {
                google_id: profile?.id,
                displayName: profile?.displayName,
                email: profile?.emails[0].value,
                email_verified: profile?.email_verified || true
            };

            if (!newUser.google_id || !newUser.email) {
                throw new Error("Invalid user data");
            }

            // Check if user exists
            const doesUserExist = await userService.findUserByGoogleID(newUser.google_id);

            // Return user data and authenticated token if user exists;
            if (doesUserExist) {
                return done(null, {
                    ...doesUserExist,
                    accessToken,
                    refreshToken
                })
            }

            // Create auth user if does not exist
            await userService.registerAuthUser(newUser);
            return done(null, { ...newUser, accessToken, refreshToken });
        } catch (err) {
            console.log("An error occured during authentication: ", err?.message);
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;
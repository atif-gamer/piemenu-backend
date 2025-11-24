import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../Models/User.js';
import dotenv from "dotenv"
dotenv.config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/v1/user/auth/google/callback',
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in our database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User exists, return the user
                    return done(null, user);
                }

                // Check if a user with this email already exists (from regular registration)
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link the Google account to existing user
                    user.googleId = profile.id;
                    user.profilePicture = profile.photos[0]?.value;
                    await user.save({ validateBeforeSave: false });
                    return done(null, user);
                }

                // Create a new user
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePicture: profile.photos[0]?.value
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password -refreshToken');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;


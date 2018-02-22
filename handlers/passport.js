const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({ googleId: profile.id }).exec();

            if (!user) {
                const newUser = await new User({ 
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    vendor: false,
                    userAuth: 11
                }).save();
                done(null, newUser);
            };

            done(null, user);
        }
    )
);
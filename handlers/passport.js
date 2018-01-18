// const passport = require('passport');
// const mongoose = require('mongoose');
// const User = mongoose.model('User');

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const keys = require('../config/keys');

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
                const newUser = await new User({ googleId: profile.id }).save();
                console.log('user', newUser);
                done(null, newUser);
            };

            done(null, user);

            // User.findOne({ googleId: profile.id }) // same as async await above
            //     .then(existingUser => {
            //         if (existingUser) {
            //             // don't save to db
            //             done(null, existingUser); 
            //         } else {
            //             // save user to db
            //             new User({ googleId: profile.id })
            //                 .save()
            //                 .then(user => done(null, user));
            //         }
            //     });
        }
    )
);
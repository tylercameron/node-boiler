const passport = require('passport');

exports.login = passport.authenticate('google', {
    scope: ['profile', 'email']
//     failureRedirect: '/login',
//     failureFlash: 'Failed Login!',
//     successRedirect: '/',
//     successFlash: 'You are now logged in!'
});

exports.googleAuth = passport.authenticate('google');

// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));

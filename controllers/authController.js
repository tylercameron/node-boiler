const passport = require('passport');

exports.login = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.googleAuth = passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); //carry on they are logged in
        return
    }
    req.flash('error', 'Oops you must be logged in to do that');
    res.redirect('/login');
};
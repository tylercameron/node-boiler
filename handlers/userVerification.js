exports.userIsVendor = (req, res, next) => {
    if (req.user && req.user.userAuth > 30) {
        console.log('is user vendor or admin');
        next(); //carry on they are a vendor or admin
        return
    }
    req.flash('error', 'Oops you must be a vendor user to do that');
    res.redirect('/');
};

exports.userIsAdmin = (req, res, next) => {
    if (req.user && req.user.userAuth > 40) {
        next(); //carry on they are admin
        return
    }
    req.flash('error', 'Oops you must be an admin to do that');
    res.redirect('/');
};
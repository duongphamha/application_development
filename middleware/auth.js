exports.isAdmin = function(req, res, next) {
    if (req.session.user && req.session.user.role == 0)
        return next();
    else {
        return res.redirect('/home');
    }
};

exports.isCustomer = function(req, res, next) {
    if (req.session.user && req.session.user.role == 1)
        return next();
    else {
        return res.redirect('/home');
    }
};

exports.isLoggedIn = function(req, res, next) {
    if (req.session.user)
        return next();
    else {
        return res.redirect('/home');
    }
};
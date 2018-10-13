var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.isAuthenticated())  {
        if (req.user.isAdmin == true) {
            next();
        } else {
            res.redirect("/dashboard");
        }
    } else {
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
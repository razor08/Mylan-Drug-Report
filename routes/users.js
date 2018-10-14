var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");
var functions = require("../middleware/functions");
var users = require("../models/users");
var moment  = require("moment");
var async = require("async");
var crypto = require("crypto");
var sendgrid = require("@sendgrid/mail");
var auth = require("../config/auth");
sendgrid.setApiKey(auth.sendgrid.apiKey);
/* GET users listing. */
router.get("/admin/users", middleware.isAdmin, function(req, res){
  res.render("usersShow");
});

router.get("/login", function(req, res){
    if (req.isAuthenticated()) {
        if (req.user.isAdmin == true) {
            res.redirect("/dashboard");
        } else {
            res.redirect("/users/show");
        }
    } else {
        res.render("login");
    }
});

router.get("/users/show",middleware.isLoggedIn, function(req, res){
    users.findOne({"uid": req.user.uid}, function(err, foundUser){
        res.render("users", {user: foundUser});
    });
});

router.get("/signup", function(req, res){
    if (req.isAuthenticated()) {
        if (req.user.isAdmin == true) {
            res.redirect("/dashboard");
        } else {
            res.redirect("/users/show");
        }
    } else {
        res.render("signup");
    }
});

router.get("/users", middleware.isAdmin, function(req, res){
    users.find({}).lean().exec(function(err, foundUsers){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("usersShow", {users: foundUsers, moment: moment});
        }
    });
});

router.get("/users/:uid/user", middleware.isAdmin, function(req, res){
    users.findOneAndUpdate({"uid": req.params.uid},{$set: {"isAdmin": false, "role": 1}}, function(err, updatedUser){
        if (err) {
            console.log(err);
            res.redirect("/users");
        } else {
            if (functions.isEmpty(updatedUser)) {
                console.log('User not found!');
                res.redirect("/");
            } else {
                res.redirect("/users");
            }
        }
    });
});

router.get("/users/:uid/admin", middleware.isAdmin, function(req, res){
    users.findOneAndUpdate({"uid": req.params.uid},{$set: {"isAdmin": true, "role": 0}}, function(err, updatedUser){
        if (err) {
            console.log(err);
            res.redirect("/users");
        } else {
            if (functions.isEmpty(updatedUser)) {
                console.log('User not found!');
                res.redirect("/");
            } else {
                res.redirect("/users");
            }
        }
    });
});

router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    res.redirect("/login");
});


router.get("/forgot", function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        res.render("forgot");
    }
});

router.post("/forgot", function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        users.findOne({"email": req.body.email}, function(err, foundUser){
            if (functions.isEmpty(foundUser)) {

                req.flash("error", "Email given not found!");
                res.redirect("/login");
            } else {
                if (!foundUser['googleUserId']) {
                    var user = foundUser;
                    async.waterfall([
                        function(done) {
                            crypto.randomBytes(20, function(err, buf) {
                                var token = buf.toString('hex');
                                done(err, token);
                            });
                        },
                        function(token, done) {
                            // User.findOne({ email: req.body.email }, function(err, user) {
                            if (!user) {
                                req.flash('error', 'No account with that email address exists.');
                                return res.redirect('/forgot');
                            }

                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                            users.findOneAndUpdate({"email" : req.body.email }, {$set: {resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000}} ,function(err, updatedUser) {
                                done(err, token, updatedUser);
                            });
                            // });
                        },
                        function(token, user, done) {

                            var mailOptions = {
                                to: user.email,
                                from: 'Mylan Drug Support<support@mylandrug.ml>',
                                subject: 'Password Reset - Mylan Drug Reporting Portal',
                                html: 'You are receiving this because you have requested the reset of the password for your account.<br><br>' +
                                    'Please click on the following link, or paste this into your browser to complete the process:.<br><br>' +
                                    'http://' + req.headers.host + '/forgot/' + token + '<br><br>' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged..<br><br>'

                            };

                            sendgrid.send(mailOptions, (err, response) => {
                                if (err) {
                                    console.log(err);
                                }

                            });
                            res.redirect("/login");
                        }
                    ], function(err) {
                        if (err){ console.log(err)};
                        res.redirect('/login');
                    });

                } else {
                    req.flash("error", "You have signed up using Google+. Please proceed with that only!");
                    res.redirect("/login");
                }
            }
        });
    }
});

router.get('/forgot/:token', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {token: req.params.token});
        });
    }
});


router.post('/forgot/:token', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        async.waterfall([
            function(done) {
                users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    if(req.body.password === req.body.confirm) {
                        user.setPassword(req.body.password, function(err) {
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;

                            user.save(function(err) {
                                req.logIn(user, function(err) {
                                    done(err, user);
                                });
                            });
                        })
                    } else {
                        req.flash("error", "Passwords do not match.");
                        return res.redirect('back');
                    }
                });
            },
            function(user, done) {

                var mailOptions = {
                    to: user.email,
                    from: 'iCap by Inversion<support@inversion.co.in>',
                    subject: 'Your Mylan Drug Reporting Portal password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account on mylandrug.ml with email: ' + user.email + ' has just been changed.\n'
                };
                sendgrid.send(mailOptions, (err, response) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        ], function(err) {
            res.redirect('/login');
        });
    }
});


module.exports = router;

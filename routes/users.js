var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");
var functions = require("../middleware/functions");
var users = require("../models/users");
var moment  = require("moment");
var functions = require("../middleware/functions");
/* GET users listing. */
router.get("/admin/users", middleware.isAdmin, function(req, res){
  res.render("usersShow");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.get("/users/show",middleware.isLoggedIn, function(req, res){
    users.findOne({"uid": req.user.uid}, function(err, foundUser){
        res.render("users", {user: foundUser});
    });
});

router.get("/signup", function(req, res){
    res.render("signup");
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

module.exports = router;

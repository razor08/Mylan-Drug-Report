var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");
var functions = require("../middleware/functions");

/* GET users listing. */
router.get("/admin/users", middleware.isAdmin, function(req, res){
  res.render("usersShow");
});

router.get("/login", function(req, res){
    res.render("login");
});

module.exports = router;

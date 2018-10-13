var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post("/post", function(req, res){
  console.log(req.body);
  res.json({success: true, message: 'Message received!'});
});

router.get("/dashboard", middleware.isAdmin, function(req, res){
    res.render("dashboard");
});

module.exports = router;

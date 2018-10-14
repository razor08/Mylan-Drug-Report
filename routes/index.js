var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/api/lot/check', function(req, res){
    var x = [""];
    var f = 0;
    for(var i=0;i<x.length;i++) {
        if (req.body.lot == x[i]) {
            f = 1;
        }
    }
    if (f == 0) {
        callback({success: true, allow: false});
    } else {
        callback({success: true, allow: true});
    }
});

router.get("/dashboard", middleware.isAdmin, function(req, res){
    res.render("dashboard");
});

module.exports = router;

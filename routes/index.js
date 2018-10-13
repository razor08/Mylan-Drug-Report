var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post("/post", function(req, res){
  console.log(req.body);
  res.json({success: true, message: 'Message received!'});
});

module.exports = router;

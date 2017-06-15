var express = require('express');
var router = express.Router();
var homepage = 'index'
var icebergSelector='interface'
var ibMap='icebergMap'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(homepage, { title: 'Express' });
});

router.get('/icebergMap', function(req, res, next) {
  res.render(ibMap, { title: 'Express' });
});

router.get('/icebergs', function(req, res, next) {
  res.render(icebergSelector, { title: 'Express' });
});

/* GET Iceberg PCD data. */
router.get('/bergdata', function(req, res) {
    var db = req.db;
    var collection = db.get('bergpcd');
    collection.find({},{},function(e,docs){
        res.render('bergdata', {
            "bergdata" : docs
        });
    });
});

module.exports = router;

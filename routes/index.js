var express = require('express');
var router = express.Router();
var homepage = 'index'
var icebergSelector='interface'
var ibMap='globalmap'
var testpage='testpage'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(homepage, { title: 'Express' });
});

router.get('/icebergMap', function(req, res, next) {
  res.render(ibMap, { title: 'Express' });
});

router.get('/interface', function(req, res, next) {
  res.render(icebergSelector, { title: 'Express' });
});

/* GET test page */
router.get('/testpage',function(req, res, next) {
  res.render(testpage, { title: 'Express' });
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

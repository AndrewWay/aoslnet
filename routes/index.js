var express = require('express');
var router = express.Router();
var homepage = 'index'
var icebergSelector='icebergSelector'
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

module.exports = router;

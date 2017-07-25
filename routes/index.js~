var express = require('express');
var router = express.Router();
var homepage = 'index'
var icebergSelector='interface'
var ibMap='globalmap'
var testpage='testpage'

/*
 * @api {get} / Renders homepage
 * @apiGroup Router
 */
router.get('/', function(req, res, next) {
  res.render(homepage, { title: 'Express' });
});

/*
 * @api {get} /icebergMap Renders iceberg map
 * @apiGroup Router
 */
router.get('/icebergMap', function(req, res, next) {
  res.render(ibMap, { title: 'Express' });
});

/*
 * @api {get} /interface Renders data interface
 * @apiGroup Router
 */
router.get('/interface', function(req, res, next) {
  res.render(icebergSelector, { title: 'Express' });
});


module.exports = router;

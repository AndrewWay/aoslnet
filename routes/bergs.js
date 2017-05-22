var express = require('express');
var router = express.Router();

router.get('/bergdata',function(req,res){
    var db = req.db;
    var collection = db.get('bergpcd');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;

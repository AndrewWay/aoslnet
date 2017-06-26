var express = require('express');
var router = express.Router();

router.get('/years',function(req,res){
    var db = req.db;
    var collection = db.get('data');
    collection.distinct("year",(function(err, docs){
            res.json(docs);      
            db.close();
     }));
});

router.get('/names/:yr',function(req,res){
    var db = req.db;    
    //var collection = db.get('data');
    var yr=req.params.yr;
    db.collection('data', function(err, collection) {
        collection.find({year : yr},{name : 1}).toArray(function(err, items) {
            res.json(items);
        });
    });
 /*   console.log("requesting from names/"+yr);
    collection.find({year : yr},{ name : 1 }).toArray(function(err, docs){
            res.json(docs);            
            db.close();
     });*/
});

router.get('/data/:yr/:nm',function(req,res){
   var db = req.db;
   var collection = db.get('data');
   var yr = req.params.yr;
   var nm = req.params.nm;
   yr=String(yr);
   collection.find({name : nm,year : yr},(function(err, docs){
       res.json(docs);            
       db.close();
   }));
});


/*router.get('icebergpic/:year/:name',function(req,res) {
  
});*/

module.exports = router;

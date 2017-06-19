var express = require('express');
var router = express.Router();

router.get('/icebergyearlist',function(req,res){
    console.log("Gathering iceberg year list");
    var db = req.db;
    var collection = db.get('bergmeas');
    collection.distinct("year",(function(err, docs){
            res.json(docs);            
            db.close();
     }));
});

router.get('/icebergnamelist/:year',function(req,res){
    var db = req.db;
    var bergyear=req.params.year;
    var collection = db.get('bergmeas');
    collection.distinct("icebergID",{year : bergyear},(function(err, docs){
            res.json(docs);            
            db.close();
     }));
});

router.get('/icebergpcd/:year/:bname',function(req,res){
   var db = req.db;
   var collection = db.get('bergpcd');
   var bergyear = req.params.year;
   var bergname = req.params.bname;
   bergyear=String(bergyear);
   console.log('[bergs] bergyear: '+bergyear+' bergname: '+bergname);
   collection.find({icebergID : bergname},(function(err, docs){
       res.json(docs);            
       db.close();
   }));
});

router.get('/icebergmeas/year/:year/id/:bname',function(req,res){
   var db = req.db;
   var collection = db.get('bergmeas');
   var bergyear = req.params.year;
   var bergname = req.params.bname;
   console.log("Requested bergname: "+bergname);
   collection.find({icebergID : bergname},(function(err, docs){
       res.json(docs);            
       db.close();
   }));
});

/*router.get('icebergpic/:year/:name'function(req,res) {
  
});*/
module.exports = router;

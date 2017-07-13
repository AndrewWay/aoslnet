var express = require('express');
var router = express.Router();
var fs  = require('fs');
var StlReader = require('stl-reader');

router.get('/test',function(req,res){
  console.log('request for stl file');
fs.readFile('public/data/pr2_head_pan.stl',function (err, data) {
    var databuffer = toArrayBuffer(data);
    if (err) {
      return console.log(err);
    }
    console.log(typeof databuffer);
    //console.log(res.vertices);
    //console.log(res.normals);
    res.json(databuffer);
  });
});

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
    var collection = db.get('data');
    var yr=req.params.yr;
    console.log("For the year :"+yr);
    collection.distinct("name",{"year" : yr},function(err, items) {
        console.log(err);  
        console.log("ITEMS: "+items);  
      res.json(items);
      db.close();
    });

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

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}


module.exports = router;

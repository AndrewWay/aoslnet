/**
 * @file Iceberg Database Inquisitor
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */
var express = require('express');
var router = express.Router();
var fs  = require('fs');
var StlReader = require('stl-reader');

/*
 * @api {get} /years Return the list of available years
 */
router.get('/years',function(req,res){
    var db = req.db;
    var collection = db.get('data');
    collection.distinct("year",(function(err, docs){
            res.json(docs);      
            db.close();
     }));
});

/*
 * @api {get} /names/:yr Return the names of icebergs for a given year
 */
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

/*
 * @api {get} /data/:yr/:nm Return the iceberg entry with name nm and year yr
 */
// TODO: Set this function to accept any type of query usable by MongoDB
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

module.exports = router;

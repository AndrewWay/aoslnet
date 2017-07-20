/**
 * @file main
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

var yearSelected="";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;
autographlimit=4;
dsstrings=new Array(0);
//strings for making data requests
namesReq='bergs/names';
yearsReq='bergs/years';
dataReq='bergs/data';

tmax=0;
disp_size=20;
playid=0;
pics=[];
time=[];
datakeys=new Map();
datamap=new Map();

/**
 * Initiates execution of all JavaScript files
 */
$(document).ready(function() { 
    document.getElementById("pausebtn").disabled=true;
    document.getElementById("stopbtn").disabled=true;
    console.log('document ready');
    var yearList = getJSON(yearsReq);
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getJSON(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);
    updateMesh('');//Render 3DMesh with no data
});

/**
 * Selects the iceberg data selected from global map
 */
function preselect(){
  var selectedID=sessionStorage.getItem('selectedID');
  var selectedYear=sessionStorage.getItem('selectedYear');
  //TODO: Clean up the if condition. Too long. 
  //TODO: Use regular expressions to detect valid names and years
  if( selectedID == 'null' || selectedID == '' || selectedYear == '' || selectedYear == 'null'){
    console.log("No pre-selected iceberg");
  }
  else{
    console.log("pre-selected iceberg: "+selectedYear+" "+selectedID );
    document.getElementById('selectYear').value=selectedYear;
    document.getElementById('selectIceberg').value=selectedID;  
  }
}
/**
 * Loads in a new list of datasets to choose from
 * @param {String} optionID 
 * @param {String} options
 */
function updateOptions(optionID,options){
    var optList = document.getElementById(optionID); 
    //Remove existing options from option list    
    while (optList.firstChild) {
        optList.removeChild(optList.firstChild);
    }
    //Append new options to option list
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.text = options[i];
        option.value= options[i];
        optList.add(option);
    }
}
/*
 * Returns the value in location index of array mapped to by arraylabel
 * @param {String} arraylabel
 * @param {Number} index
 * @return {Number} datum
 */
function getDatum(arraylabel,index){
  var arr = datamap.get(arraylabel);
  var ret=arr[index];
  return ret;
}

/*
 * Changes the list of icebergs available to view
 */
function changeYear(){
    console.log('changeYear() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getJSON(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}

//TODO Break up this function
function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var json = getJSON(dataReq+'/'+yearSelected+'/'+bergSelected);  

    //After data extracted, do special checks for AOSL specific data
    //TODO if height, width, volume exist, create special monitors
    var height=json[0].height;
    var width=json[0].width;
    var volume=json[0].volume;
    //TODO if longitude and latitude exist, create map. Have map invisible by default
    var longitude=json[0].longitude;
    var latitude=json[0].latitude;
    centerlong=longitude;
    centerlat=latitude;
    console.log("height: "+height);
    console.log("width: "+width);
    console.log("volume: "+volume);
    console.log("longitude: "+longitude);
    console.log("latitude: "+latitude);
    console.log(typeof longitude);    

    if(typeof longitude === 'number'){
      if(!(longitude>= -180 && longitude <= 180)){
        console.log("longitude invalid: out of range.");
        longitude=0;
      }
    }
    else{
      console.log("longitude invalid: not of type 'number'")
      longitude=0;    
    }
    if(typeof latitude === 'number'){
      if(!(latitude>=-90 && latitude <= 90)){
        console.log("latitude invalid: out of range.");
        latitude=0;
      }
    }
    else{
      console.log("latitude invalid: not of type 'number'")
      latitude=0;    
    }
    //updateMesh(filepath);
    //updateDim(height,width,volume);
      //Check what data keys are available from the JSON
    extractKeyPaths(json[0].Data[0]);//Only checks first element
    distributeData(json[0].Data);
    createAllDisplays();
    setPosition(latitude,longitude,14);
    setMarker(latitude,longitude);
    var sdpath_lat=datamap.get('latitudeSD');
    var sdpath_long=datamap.get('longitudeSD');
    var ibpath_lat=datamap.get('latI0');
    var ibpath_long=datamap.get('longI0');
    console.log(sdpath_lat);
    setZoom(14);
    setPosition(latitude,longitude);
    displaySDPosition(latitude,longitude);
    setSDPath(sdpath_lat,sdpath_long);
    setIBPath(ibpath_lat,ibpath_long);
    //temporarypath(latitude,longitude,sdpath_lat,sdpath_long,ibpath_lat,ibpath_long);
    for(var i=0;i<graph_ids.length;i++){
      var arraylabel=graph_ids[i].replace('graph_','');
      var arr = datamap.get(arraylabel);
      setplotData(graph_ids[i],arr);
    }
    updateTimeMax(json[0].Data.length);
    console.log('changeIceberg() finished');
}



function createAllDisplays(){
  for(var i=0;i<dsstrings.length;i++){
    var label=dsstrings[i];
    if($("#graphs > div").length < autographlimit){
      //create a graph
      createDisplay('graph',label);
    }
    else{
      //Create a monitor
      createDisplay('monitor',label);
    }
  }
}

function createDisplay(type,label){
  if( type === 'graph'){
    addChart(label);
  }
  else if(type === 'monitor'){
    addDisplay(label);
  }
}

function extractKeyPaths(json){
  var keys=Object.keys(json);
  for(var i=0;i<keys.length;i++){
    var childkey=keys[i];
    var child=json[childkey];
    if(child !== null && typeof child === 'object'){
      keypathHelper(childkey,childkey,child); 
    }
    else{
      dsstrings.push(childkey);
    }
  }
}

function keypathHelper(keypath,key,json){
  var keys=Object.keys(json);
  for(var i=0;i<keys.length;i++){
    var childkey=keys[i];
    var child=json[childkey];
    var childkeypath=keypath+'&'+childkey;
    if(child !== null && typeof child === 'object'){
      keypathHelper(childkeypath,childkey,child); 
    }
    else{
      dsstrings.push(childkeypath);
    }
  }
}

function distributeData(dat){
    console.log('distributeData() start');
    setSize = dat.length;
    console.log("Measurement data set size: "+setSize);
    time=new Array(setSize);
    for(i=0;i<dsstrings.length;i++){
      var tmparray=new Array(setSize);
      var keypath=dsstrings[i];    
      for(j=0;j<setSize;j++){
        var datum=dat[j];      
        tmparray[j] = keytoValue(keypath,datum);
      }
      datamap.set(keypath,tmparray);
    }
    console.log('distributeData() finished');
}

function keytoValue(keypath,json){
  var keyarray=keypath.split("&");
  for(var i=0;i<keyarray.length;i++){
    var key=keyarray[i];  
    if(json.hasOwnProperty(key)){
      json=json[key];
    }
  }
  return json;
}

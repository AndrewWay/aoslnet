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
$(document).ready(function() { 
    document.getElementById("pausebtn").disabled=true;
    document.getElementById("stopbtn").disabled=true;
    console.log('document ready');
    var yearList = getList(yearsReq);
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);
    updateMesh('');//Render 3DMesh with no data
});

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

function getDatum(arraylabel,index){
  var arr = datamap.get(arraylabel);
  var ret=arr[index];
  return ret;
}

function changeYear(){
    console.log('changeYear() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}

function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var json = getJSON(dataReq+'/'+yearSelected+'/'+bergSelected);  

    var height=json[0].height;
    var width=json[0].width;
    var volume=json[0].volume;
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
      if(!(longitude>=-180 && longitude <= 180)){
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
    //displayWind(windSpd,windDir); 
   //testkeys=extractDataKeys(json[0].Data[0]);
    extractKeyPaths(json[0].Data[0]);//Only checks first element
    distributeData(json[0].Data);
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

    // updateMap(latitude,longitude);
    // setMapData();  
    for(var i=0;i<graph_ids.length;i++){
      var arraylabel=graph_ids[i].replace('graph_','');
      var arr = datamap.get(arraylabel);
      setplotData(graph_ids[i],arr);
    }
    updateTimeMax(json[0].Data.length);
    console.log('changeIceberg() finished');
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

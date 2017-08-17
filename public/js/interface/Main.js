/**
 * @file main
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */
 
/* CONSTANTS */
var PI = 3.14159265359;

/* AOSL JSON LABEL NAMES */
var latitudeName = 'latitudeSD';
var longitudeName = 'longitudeSD';
var orientationName = 'orientationSD';
var icebergLatitudeName = 'latI0';
var icebergLongitudeName = 'longI0';

/* SIMULATION OBJECTS */
var sim; // Simulation object

/* 3D MODEL OBJECTS */
var IcebergPointCloud; // Iceberg point cloud object
var SeaDragon; // SeaDragon object
var Iceberg; // Iceberg object
var oilRig; // Oilrig object

/* MAP OBJECTS */
var map;
var surveyMarker; // Marker to indicate location of survey
var seaDragonMarker;

/* HTML IDs */
var icebergNameOptionsID = "selectName";
var icebergYearOptionsID = "selectYear";
var modelcontainerid = 'model';

/* INTERFACE PARAMETERS */
var chartLimit = 0; // Maximum number of charts
var monitorLimit = 4; // Maximum number of displays (charts + monitors)
var chartQuantity = 0; // Tracks the number of charts
var monitorQuantity = 0; // Tracks the number of monitors
var SDBottom = -1;

/* REQUEST URLs */
var namesReq = 'bergs/names';
var yearsReq = 'bergs/years';
var dataReq = 'bergs/data';

/* FILEPATHS */
var SeaDragonFilePath = 'data/models/seadragon/SeaDragon_small.stl';
var OilRigFilePath = 'data/models/oilrig/oilrig.obj';
/* MISC */
var dataSourcesProcessed = 0; // Kind of cryptic variable. Tracks how many data sources of the JSON have been displayed. Will likely change this name in the future

/* TEST VARIABLES */
var MarkerTest;
var test_i = 0;

var SDx;
var SDy;
var SDz;
var SDorigin;
function testfunction(){
//Fill with stuff you want to test after clicked test button
  SDx = Mesh(SeaDragonFilePath);
  SDy = Mesh(SeaDragonFilePath);
  SDz = Mesh(SeaDragonFilePath);
  SDorigin = Mesh(SeaDragonFilePath);
  
  SDx.setColor('#ff0000'); // RED
  SDy.setColor('#0000ff'); // BLUE
  SDz.setColor('#00ff00'); // GREEN
  SDorigin.setColor('#ffffff'); // WHITE
  
  SDx.loadModel(0);
  SDy.loadModel(0);
  SDz.loadModel(0);
  SDorigin.loadModel(0);
  
}

function testfunction2(){
//Fill with stuff you want to test after clicking test2 button
  SDx.setPosition(100,0,0);
  SDy.setPosition(0,100,0);
  SDz.setPosition(0,0,100);
  SDorigin.setPosition(0,0,0);
}
/**
 * Initiates execution of all functions for setting the page up
 */
$(document).ready(function () {
    document.getElementById("pausebtn").disabled = true;
    document.getElementById("stopbtn").disabled = true;
    console.log('Document ready');
    var yearList = getJSON(yearsReq);
    updateOptions('selectYear', yearList);
    var yearSelected = document.getElementById(icebergYearOptionsID).value;
    var bergList = getJSON(namesReq + '/' + yearSelected);
    updateOptions(icebergNameOptionsID, bergList);
    createScene();
    autoselect();
    });

/**
 * Selects the iceberg data chosen from global map
 * Maybe check if cookie exists
 * If so, call correct functions to load iceberg survey corresponding to data found in cookie
 */

/**
 * Loads in a new list of datasets to choose from
 * @param {String} optionID 
 * @param {String} options
 */
function updateOptions(optionID, options) {
  var optList = document.getElementById(optionID);
  //Remove existing options from option list    
  while (optList.firstChild) {
    optList.removeChild(optList.firstChild);
  }
  //Append new options to option list
  for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    option.value = options[i];
    optList.add(option);
  }
}

/**
 * Get the value of the selected year
 */
 function getSelectedYear(){
   return document.getElementById(icebergYearOptionsID).value;
 }
 
/**
 * Get the value of the selected name
 */
 function getSelectedName(){
   return document.getElementById(icebergNameOptionsID).value;
 }
 
/**
 * Changes the list of icebergs available to view
 */
function changeYear() {
  console.log('changeYear() starting');
  var yearSelected = document.getElementById(icebergYearOptionsID).value;
  var bergList = getJSON(namesReq + '/' + yearSelected);
  updateOptions(icebergNameOptionsID, bergList);
  console.log('changeYear() finished');
}

/**
 * Load the data corresponding to the currently selected iceberg survey
 * @param {String} The year of the iceberg
 * @param {String} The name of the iceberg
 */
function changeIceberg(yearSelected,bergSelected) {
  console.log('changeIceberg() starting');
  //var yearSelected = document.getElementById(icebergYearOptionsID).value;
  //var bergSelected = document.getElementById("selectIceberg").value;
  var json = getJSON(dataReq + '/' + yearSelected + '/' + bergSelected);
  if (json.constructor == Array) {
    json = json[0];
  }
  console.log(json);
  if(json.hasOwnProperty('Data') && json['Data'].length > 0){
    extractKeyPaths(json['Data'][0]); //Only checks first element
    distributeData(json['Data']); 
    var setSize = json['Data'].length;
    console.log('SETSIZE: '+setSize);
    sim = new Simulation(setSize); // Create a new simulation with data set size = setSize
    createCharts();
    createMonitors();
  }

  //displayDimensions(json);
  displaySeaDragon(json);
  displayMap(json);
  displayIceberg(json);
  displayPointCloud(json);
  console.log('changeIceberg() finished');
}
/**
 * Callback function from Google Map
 * Probably not necessary
 */
function createMap(){
  console.log('Google Map ready to be created');
  //map = new GoogleMap('map');
}

//Read in iceberg name and year from cookie to automatically load the corresponding iceberg on
//page load

function autoselect() {
  //Get the year of the iceberg from cookie
  var iceyear = getCookie("Year");
  var yearList = document.getElementById(icebergYearOptionsID)
  //Set the year from option list to iceyear
  for (var i = 0; i < yearList.length ; i++){
    if (yearList.options[i].value === iceyear) {
      yearList.selected = yearList.options[i];
      yearList.value = yearList.options[i].value;
      i = yearList.length;
    }
  }
  //Get the icebergs from the database corresponding to that year
  var bergList = getJSON(namesReq + '/' + iceyear);
  //Update the iceberg name list with the names from iceyear
  updateOptions(icebergNameOptionsID, bergList);
  //Get the name of the iceberg from cookie
  var icename = getCookie("Name");
  var nameList = document.getElementById(icebergNameOptionsID);
  //Set the name from names option list to icename
  for (var i = 0; i < nameList.length ; i++){
    if (nameList.options[i].value === icename) {
      nameList.selected = nameList.options[i];
      i = nameList.length;
    }
  }
  changeIceberg(iceyear,icename);
}

//Get a previously set cookie

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Check to ensure a cookie has been set and is read properly

function checkCookie() {
    var username = getCookie("Name");
    var year = getCookie("Year");
    if (username != "") {
        alert("Welcome again " + username + " " + year);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("Name", username, 365);
        }
    }
}


/**
 * Creates charts for data sources
 */
function createCharts(){
  while(dataSourcesProcessed < jsonKeyPaths.length && chartQuantity < chartLimit){
    var index = dataSourcesProcessed;
    var keyPath = jsonKeyPaths[index];
    var dataArray = jsonDataMap.get(keyPath);
    if(!dataArray.some(isNaN) && dataArray.length > 0){ // Check if the data array only contains at least one number
      //Create a new chart
      console.log('Adding chart: '+keyPath);
      var newChart = new DataChart(keyPath,'graphs');
      newChart.setChartData(dataArray);
      newChart.autoResizeAxes();
      newChart.refresh();
      sim.manageChart(newChart);
      chartQuantity++;
    }
    dataSourcesProcessed++;
  }
}
/**
 * Create monitors for data sources
 */
function createMonitors(){
  while(dataSourcesProcessed < jsonKeyPaths.length && monitorQuantity < monitorLimit){
    var index = dataSourcesProcessed;
    var keyPath = jsonKeyPaths[index];
    var dataArray = jsonDataMap.get(keyPath);
    if(!dataArray.some(isNaN) && dataArray.length > 0){ // Check if the data array only contains at least one number
      var newMonitor = new DataMonitor(keyPath,'monitorTable');
      newMonitor.setData(dataArray);
      sim.manageMonitor(newMonitor);
      monitorQuantity++;
    }
    dataSourcesProcessed++;
  }
}

/**
 * Display Oilrig model
 */
function displayRig(){
  oilRig = Mesh(OilRigFilePath);
  oilRig.loadModel();
}

/**
 * Display iceberg mesh
 * @param {object} json
 */
function displayIceberg(json) {
  //Load the STL file
  if (json.hasOwnProperty('stlpath')) {
    var filepath = json['stlpath'];
    console.log('loading stl from ' + filepath);
    Iceberg = Mesh(filepath);
    Iceberg.setColor('#ffffff');
    Iceberg.loadModel(-1.5708); //TODO Don't pass rotation as argument. make sure models are in consistent frame
    addToggle('meshtoggle', 'Iceberg.toggle();', 'Toggle Mesh');
  }
}

function displayIcebergMarker(){
  if(jsonDataMap.has(icebergLatitudeName)){
    if(jsonDataMap.has(icebergLongitudeName)){
      var latitudeArray = jsonDataMap.get(icebergLatitudeName);
      var longitudeArray = jsonDataMap.get(icebergLongitudeName);
      icebergMarker = IrregularMarker(map.getMap(),latitudeArray,longitudeArray);  
      icebergMarker.displayPath();
      sim.manage(icebergMarker);   
    }
    else{
      console.log('No SeaDragon longitude array');
    }
  }
  else{
    console.log('No SeaDragon latitude array');
  }
}

/**
 * Convert GPS position data object to local frame position data object
 */
function gpsToLocal(gpsData){
  var lat = gpsData.lat;
  var long = gpsData.long;
  var alt = gpsData.alt;
  console.log('LAT');
  console.log(lat);
  console.log('LONG');
  console.log(long);

  var gpsOrigin = gpsData.origin;
  var latOrigin = gpsData.origin.lat;
  var longOrigin = gpsData.origin.long;
  var altOrigin = gpsData.origin.alt;

  var localData = {};
  localData.origin = {};
  localData.origin.x = long2x(latOrigin,longOrigin);
  localData.origin.y = lat2y(latOrigin);
  console.log('ORIGINS');
  console.log(localData.origin.x);
  console.log(localData.origin.y);
  localData.origin.z = altOrigin;
  
  
  var minArraySize = 0;
  if(lat.length < long.length){
    minArraySize = lat.length;
  }
  else{
    minArraySize = long.length;
  }
  if(alt.length < minArraySize ){
    minArraySize = alt.length;
  }
  
  for (i = 0; i < minArraySize; i++) {
    long[i] = long2x(lat[i],long[i]) - localData.origin.x;
    lat[i] = lat2y(lat[i]) - localData.origin.y;
    alt[i] = alt[i] - localData.origin.z;
  }
  localData.x = long;
  localData.y = lat;
  localData.z = alt;

  return localData;
}

/**
 * Convert latitude degrees to metres
 * @param {number} latitude degrees
 * @param {number} longitude degrees
 * @returns {number} Latitude degrees in metres
 */
var long2x = function (lat,long) {
  return 111120*long*Math.cos(lat * PI / 180);
};

/**
 * Convert longitude degrees to metres
 * @param {number} longitude degrees
 * @returns {number} Longitude degrees in metres
 */
var lat2y = function (lat) {
  return 111120*lat;
};


function gpsPointCloud(json){
 // if(json.hasOwnPropert(''))
  
  
  var gpsPC = PointCloud(x,y,z);
  gpsPC.loadPointCloud();
}
/**
 * Create and display SeaDragon model
 */
function displaySeaDragon(json){
  // if(jsonDataMap.has(orientationName)){
  if(jsonDataMap.has(latitudeName) && jsonDataMap.get(latitudeName).length > 0){
    if(jsonDataMap.has(longitudeName) && jsonDataMap.get(longitudeName).length > 0){
      if(json.hasOwnProperty('latitude')){
        if(json.hasOwnProperty('longitude')){

          SeaDragon = Mesh(SeaDragonFilePath);
          SeaDragon.setColor('#ffff00');
          var latitudeArray = jsonDataMap.get(latitudeName);
          console.log('LATARRAYLENGTH: '+latitudeArray.length);
          var longitudeArray = jsonDataMap.get(longitudeName);
          var orientationArray = jsonDataMap.get(orientationName); //TODO Account for orientation
          var gps = {};
          gps.lat = latitudeArray;
          gps.long = longitudeArray;
          var altitudeArray = [];
          for(var i = 0; i < latitudeArray.length; i++){
            altitudeArray.push(SDBottom);
          }
          gps.alt = altitudeArray;
          gps.origin = {};
          gps.origin.lat = json['latitude'];
          gps.origin.long = json['longitude'];
          gps.origin.alt = 0;
          var localPositionData = gpsToLocal(gps);
          console.log(localPositionData.x);
          console.log(localPositionData.y);
          console.log(localPositionData.z);
          
          SeaDragon.setPositionData(localPositionData);
          SeaDragon.loadModel(0);
          sim.manage(SeaDragon);
        }
        else{
          console.log('No longitude origin provided');
        }
      }
      else{
        console.log('No latitude origin provided');
      }
    }
    else{
      console.log('No SeaDragon longitude array');
    }
  }
  else{
    console.log('No SeaDragon latitude array');
  }
  /* }
     else{
     console.log('No SeaDragon orientations array');
     } */
}

/**
 * Create and display SeaDragon Marker
 */
function displaySeaDragonMarker(json){
  console.log('Displaying SeaDragon Marker');
  // if(jsonDataMap.has(orientationName)){
  if(jsonDataMap.has(latitudeName)){
    if(jsonDataMap.has(longitudeName)){
      var latitudeArray = jsonDataMap.get(latitudeName);
      var longitudeArray = jsonDataMap.get(longitudeName);
      var orientationArray = jsonDataMap.get(orientationName);
      seaDragonMarker = TriangleMarker(map.getMap(),latitudeArray,longitudeArray,orientationArray);  
      seaDragonMarker.displayPath();
      sim.manage(seaDragonMarker);   
    }
    else{
      console.log('No SeaDragon longitude array');
    }
  }
  else{
    console.log('No SeaDragon latitude array');
  }
  /* }
     else{
     console.log('No SeaDragon orientations array');
     } */
}

/**
 * Displays the dimensions of the iceberg
 * @param {object} json The JSON that contains the dimensions
 */
function displayDimensions(json) {
  if (json.hasOwnProperty('height')) {
    var height = json.height;
    //TODO add height monitor
  }
  if (json.hasOwnProperty('width')) {
    var width = json.width;
    //TODO add width monitor
  }
  if (json.hasOwnProperty('volume')) {
    var volume = json.volume;
    //TODO add volume monitor 
  }
}

/**
 * Display markers and polygons on Google Map
 * @param {object} json
 */
function displayMap(json) {
  //TODO if longitude and latitude exist, create map. Have map invisible by default
  //Load longitude and latitude of iceberg
  if (json.hasOwnProperty('longitude') && json.hasOwnProperty('latitude')) {
    var longitude = json.longitude;
    var latitude = json.latitude;
    var displayMapBool = 1;
    if (typeof longitude === 'number') {
      if (!(longitude >= -180 && longitude <= 180)) {
        console.log("longitude invalid: out of range.");
        displayMapBool = 0;
      }
    }
    else {
      console.log("longitude invalid: not of type 'number'")
        displayMapBool = 0;
    }
    if (typeof latitude === 'number') {
      if (!(latitude >= -90 && latitude <= 90)) {
        console.log("latitude invalid: out of range.");
        displayMapBool = 0;
      }
    }
    else {
      console.log("latitude invalid: not of type 'number'")
        displayMapBool = 0;
    }
    if(displayMapBool == 1){
      map = new GoogleMap('map');
      map.setCenter(latitude,longitude);
      surveyMarker = new Marker(map.getMap(),[latitude],[longitude]);
      surveyMarker.display();
      displaySeaDragonMarker();
      displayIcebergMarker();
      //  map.setMarker(latitude,longitude);
      //  map.displaySDPosition(latitude,longitude);
      map.setZoom(15);
    }
  }
}


/**
 * Display point cloud
 * @param {object} json
 */
function displayPointCloud(json) {
  //Load the point cloud data
  var xarray_check = json.hasOwnProperty('x');
  var yarray_check = json.hasOwnProperty('y');
  var zarray_check = json.hasOwnProperty('z');

  if (xarray_check && yarray_check && zarray_check) {
    var x = json['x'];
    var y = json['y'];
    var z = json['z'];
    console.log('POINT CLOUD');
    console.log(x);
    console.log(y);
    console.log(z);
    if(x.length > 0 && y.length > 0 && z.length > 0){
      console.log('creating point cloud model');
      console.log(DEMO);
      IcebergPointCloud = PointCloud(x, y, z);
      IcebergPointCloud.loadPointCloud();
      addToggle('pointstoggle', 'IcebergPointCloud.toggle()', 'Toggle Points'); 
    }
  }
}

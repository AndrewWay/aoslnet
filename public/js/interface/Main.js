/**
 * @file main
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */
var PI = 3.14159265359;

var latitudeName = 'latitudeSD';
var longitudeName = 'longitudeSD';
var orientationName = 'orientationSD';
var icebergLatitudeName = 'latI0';
var icebergLongitudeName = 'longI0';

var sim; // Simulation object
var IcebergPointCloud; // Iceberg point cloud object
var SeaDragon; // SeaDragon object
var Iceberg; // Iceberg object
var map;
var surveyMarker; // Marker to indicate location of survey
var seaDragonMarker;
var yearSelected = ""; // Tracks the selected year
var icebergSelected = ""; // Tracks the selected iceberg name
var IcebergModelName = "";

var chartLimit = 0; // Maximum number of charts
var monitorLimit = 4; // Maximum number of displays (charts + monitors)
var chartQuantity = 0; // Tracks the number of charts
var monitorQuantity = 0; // Tracks the number of monitors
var dataSourcesProcessed = 0; // Kind of cryptic variable. Tracks how many data sources of the JSON have been displayed. Will likely change this name in the future
//strings for making data requests
namesReq = 'bergs/names';
yearsReq = 'bergs/years';
dataReq = 'bergs/data';
SeaDragonFilePath = 'data/models/seadragon/SeaDragon(Simple+FullSize).STL';
modelcontainerid = 'model';

disp_size = 20;
var SDBottom = -160;
var MarkerTest;
var test_i = 0;
function testfunction(){
  console.log('Test function 1');
  var long = [-45,-44,-43,-42,-20];
  var lat = [60,65,70,75,80];
  var or = [1,0,40,30,-20];

  var gmap = map.getMap();
  MarkerTest = new TriangleMarker(gmap,lat,long,or);
  MarkerTest.setIconColor('#bd5151');
  MarkerTest.refreshIcon();
  MarkerTest.addPath();
}
function testfunction2(){
  console.log('Test function 2');
  MarkerTest.play(test_i);
  test_i++;
  if(test_i == 4){
    test_i = 0;
  }
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
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getJSON(namesReq + '/' + yearSelected);
    updateOptions('selectIceberg', bergList);
    createScene();
    });

/**
 * Selects the iceberg data chosen from global map
 */
function preselect() {
  var selectedID = sessionStorage.getItem('selectedID');
  var selectedYear = sessionStorage.getItem('selectedYear');
  //TODO: Clean up the if condition. Too long. 
  //TODO: Use regular expressions to detect valid names and years
  if (selectedID == 'null' || selectedID == '' || selectedYear == '' || selectedYear == 'null') {
    console.log("No pre-selected iceberg");
  }
  else {
    console.log("pre-selected iceberg: " + selectedYear + " " + selectedID);
    document.getElementById('selectYear').value = selectedYear;
    document.getElementById('selectIceberg').value = selectedID;
  }
}

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
 * Load the data corresponding to the currently selected iceberg survey
 */
function changeIceberg() {
  console.log('changeIceberg() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergSelected = document.getElementById("selectIceberg").value;
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
function createMap(){
  console.log('Google Map ready to be created');
  //map = new GoogleMap('map');
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
 * Display iceberg mesh
 * @param {object} json
 */
function displayIceberg(json) {
  //Load the STL file
  if (json.hasOwnProperty('stlpath')) {
    var filepath = json['stlpath'];
    console.log('loading stl from ' + filepath);
    Iceberg = Mesh('data/models/stl/r11i02.stl');
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
 * TODO Fix this function
 *
 * Convert SeaDragon latitude and longitude to point cloud local frame
 * @param {Array} x Latitude positions of Model
 * @param {Array} y Longitude positions of Model
 * @param {Array} z Depth positions of Model
 * @param {Array} gps_origin Origin in the world frame in GPS coordinates
 */
function setModelPosition(model,x, y, z, gps_origin) {
  var xorigin = gps_origin[0];
  var yorigin = gps_origin[1];
  console.log(yorigin);
  var xorigin_m = lat2m(xorigin);
  var yorigin_m = long2m(yorigin);
  console.log(yorigin_m);
  console.log('Converting gps to local');
  console.log(x);
  console.log(y);
  // Convert xy coordinates to metres and relative to local frame
  for (i = 0; i < x.length; i++) {
    x[i] = lat2m(x[i]) - xorigin_m;
    y[i] = long2m(y[i]) - yorigin_m;
  }
  model.setPositionData(x,y,z);
};

function gpsToLocal(gpsData){
  var lat = gpsData.lat;
  var long = gpsData.long;
  var alt = gpsData.alt;

  var gpsOrigin = gpsData.origin;
  var latOrigin = gpsData.origin.lat;
  var longOrigin = gpsData.origin.long;
  var altOrigin = gpsData.origin.alt;

  var localData = {};
  localData.origin = {};
  localData.origin.x = lat2m(latOrigin);
  localData.origin.y = long2m(longOrigin);
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
    lat[i] = lat2m(lat[i]) - localData.origin.x;
    long[i] = long2m(long[i]) - localData.origin.y;
    alt[i] = alt[i] - localData.origin.z;
  }
  localData.x = long;
  localData.y = alt;
  localData.z = lat;

  return localData;
}
/**
 * Convert latitude degrees to metres
 * @param {number} latitude degrees
 * @returns {number} Latitude degrees in metres
 */
var lat2m = function (phi) {
  phi = phi * PI / 180;
  return 111132.92 - 559.82 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi) - 0.0023 * Math.cos(6 * phi);
};

/**
 * Convert longitude degrees to metres
 * @param {number} longitude degrees
 * @returns {number} Longitude degrees in metres
 */
var long2m = function (theta) {
  theta = theta * PI / 180;
  return 111412.84 * Math.cos(theta) - 93.5 * Math.cos(3 * theta) + 0.118 * Math.cos(5 * theta);
};

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
 * Changes the list of icebergs available to view
 */
function changeYear() {
  console.log('changeYear() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergList = getJSON(namesReq + '/' + yearSelected);
  updateOptions('selectIceberg', bergList);
  console.log('changeYear() finished');
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
    if(x.length > 0 && y.length > 0 && z.length > 0){
      console.log('creating point cloud model');
      console.log(DEMO);
      IcebergPointCloud = PointCloud(x, y, z);
      IcebergPointCloud.loadPointCloud();
      addToggle('pointstoggle', 'IcebergPointCloud.toggle()', 'Toggle Points'); 
    }
  }
}

/**
 * Obsolete function
 */
function loadData(json) {
  //Load timestamped data array
  if (json.hasOwnProperty('Data') && json['Data'].length > 0) {

    createAllDisplays();
    var sdpath_lat = datamap.get('latitudeSD');
    var sdpath_long = datamap.get('longitudeSD');
    var ibpath_lat = datamap.get('latI0');
    var ibpath_long = datamap.get('longI0');
    AOSL_setSDCoords(sdpath_lat, sdpath_long);
    //setSDPath(sdpath_lat,sdpath_long);
    //setIBPath(ibpath_lat,ibpath_long);
    for (var i = 0; i < graph_ids.length; i++) {
      var arraylabel = graph_ids[i].replace('graph_', '');
      var arr = datamap.get(arraylabel);
      setplotData(graph_ids[i], arr);
    }
    sim.updateTimeMax(json.Data.length);
    //Simulation.setSD(sdpath_lat,sdpath_long,[latitude,longitude]);
    SeaDragon = new Mesh(SeaDragonFilePath);
    SeaDragon.loadModel();
  }
}






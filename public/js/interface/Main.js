/**
 * @file main
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

var sim; // Simulation object
var IcebergPointCloud; // Iceberg point cloud object
var SeaDragon; // SeaDragon object
var Iceberg; // Iceberg object
var yearSelected = ""; // Tracks the selected year
var icebergSelected = ""; // Tracks the selected iceberg name
var IcebergModelName = "";

var chartLimit = 2; // Maximum number of charts
var monitorLimit = 4; // Maximum number of displays (charts + monitors)
var chartQuantity = 0; // Tracks the number of charts
var monitorQuantity = 0; // Tracks the number of monitors
var dataSourcesProcessed = 0; // Kind of cryptic variable. Tracks how many data sources of the JSON have been displayed
//strings for making data requests
namesReq = 'bergs/names';
yearsReq = 'bergs/years';
dataReq = 'bergs/data';
SeaDragonFilePath = 'data/models/seadragon/SeaDragon(Simple+FullSize).STL';
modelcontainerid = 'model';

disp_size = 20;
SDBottom = -160;
var SD2;
function testfunction(){
  
  SD2 = Mesh(SeaDragonFilePath);
  SD2.loadModel();


}
function testfunction2(){
  SD2.setPosition(SDBottom,SDBottom,SDBottom);
  SD2.setYaw(1.5708);
  SD2.setPitch(1.5708);
}
/**
 * Initiates execution of all functions for setting the page up
 */
$(document).ready(function () {
    document.getElementById("pausebtn").disabled = true;
    document.getElementById("stopbtn").disabled = true;
    console.log('document ready');
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
    sim = new Simulation(setSize); // Create a new simulation with data set size = setSize
    createCharts();
    createMonitors();
  }

  //displayDimensions(json);
  //gpsDisplay(json);
  displayIceberg(json);
  displayPointCloud(json);
  displaySeaDragon(json);

  console.log('changeIceberg() finished');
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
      console.log(dataArray);
      newMonitor.setData(dataArray);
      sim.manageMonitor(newMonitor);
      monitorQuantity++;
    }
    dataSourcesProcessed++;
  }
}

/**
 * Create and display SeaDragon model
 */
function displaySeaDragon(json){
  SeaDragon = Mesh(SeaDragonFilePath);
  SeaDragon.loadModel();
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
function gpsDisplay(json) {
  //TODO if longitude and latitude exist, create map. Have map invisible by default
  //Load longitude and latitude of iceberg
  if (json.hasOwnProperty('longitude') && json.hasOwnProperty('latitude')) {
    var longitude = json.longitude;
    var latitude = json.latitude;
    if (typeof longitude === 'number') {
      if (!(longitude >= -180 && longitude <= 180)) {
        console.log("longitude invalid: out of range.");
        longitude = 0;
      }
    }
    else {
      console.log("longitude invalid: not of type 'number'")
        longitude = 0;
    }
    if (typeof latitude === 'number') {
      if (!(latitude >= -90 && latitude <= 90)) {
        console.log("latitude invalid: out of range.");
        latitude = 0;
      }
    }
    else {
      console.log("latitude invalid: not of type 'number'")
        latitude = 0;
    }
    //setPosition(latitude,longitude);
    //setMarker(latitude,longitude);
    //setPosition(latitude,longitude);
    //displaySDPosition(latitude,longitude);
    //setZoom(15);
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
    console.log(DEMO);
    Iceberg = Mesh('data/models/stl/r11i02.stl');
    Iceberg.loadModel();
    addToggle('meshtoggle', 'Iceberg.toggle();', 'Toggle Mesh');
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

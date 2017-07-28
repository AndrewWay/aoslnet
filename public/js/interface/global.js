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
SDBottom=-170;
/**
 * Initiates execution of all functions for setting the page up
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
		// updateMesh('');//Render 3DMesh with no data
		});

/**
 * Selects the iceberg data chosen from global map
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
	createScene();
	if(json.constructor == Array){
		json = json[0];
	}    
	console.log(typeof json);


	if(json.hasOwnProperty('height')){
		var height=json.height;  
		//TODO add height monitor
	}
	if(json.hasOwnProperty('width')){
		var width=json.width;  
		//TODO add width monitor
	}
	if(json.hasOwnProperty('volume')){
		var volume=json.volume; 
		//TODO add volume monitor 
	}

	//TODO if longitude and latitude exist, create map. Have map invisible by default
	//Load longitude and latitude of iceberg
	if(json.hasOwnProperty('longitude') && json.hasOwnProperty('latitude')){
		var longitude=json.longitude;
		var latitude=json.latitude;
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
		setPosition(latitude,longitude);
		setMarker(latitude,longitude);
		setPosition(latitude,longitude);
		displaySDPosition(latitude,longitude);
		setZoom(15);
	}

	  //Load the STL file
	if(json.hasOwnProperty('stlpath')){
		var filepath=json['stlpath'];
		console.log('loading stl from '+filepath);     
		setfile(filepath);
		addToggle('meshtoggle','toggleMesh();','Toggle Mesh');
	  loadModel();
	}
    //Load the point cloud data
	var xarray_check=json.hasOwnProperty('x');
	var yarray_check=json.hasOwnProperty('y');
	var zarray_check=json.hasOwnProperty('z');  

	if( xarray_check && yarray_check && zarray_check ){
		var x = json['x'];
		var y = json['y'];
		var z = json['z'];
		setPointCloud(x,y,z)
		addToggle('pointstoggle','togglePoints();','Toggle Points');
	  loadPointCloud();
	}
  render();
	animate();
  
	  //Load timestamped data array
	if(json.hasOwnProperty('Data') && json['Data'].length > 0){
		extractKeyPaths(json['Data'][0]);//Only checks first element
		distributeData(json['Data']);
		createAllDisplays();
		var sdpath_lat=datamap.get('latitudeSD');
		var sdpath_long=datamap.get('longitudeSD');
		var ibpath_lat=datamap.get('latI0');
		var ibpath_long=datamap.get('longI0');
		AOSL_setSDCoords(sdpath_lat,sdpath_long);
		setSDPath(sdpath_lat,sdpath_long);
		setIBPath(ibpath_lat,ibpath_long);
		for(var i=0;i<graph_ids.length;i++){
			var arraylabel=graph_ids[i].replace('graph_','');
			var arr = datamap.get(arraylabel);
			setplotData(graph_ids[i],arr);
		}
		updateTimeMax(json.Data.length);
	  setSD(sdpath_lat,sdpath_long,[latitude,longitude]);
	  loadSeaDragon();
	}
	console.log('changeIceberg() finished');
}

/*
 * Add toggle for displaying 3D Objects
 */
function addToggle(id,callback,name){
  var element = document.createElement("input");
  element.type="button";
  element.name=name;
  element.value=name;
  element.onclick=callback;
  element.setAttribute('onclick',  callback);
  var toggleContainer=document.getElementById('pics');
  toggleContainer.append(element);
}
/*
 * Check for AOSL specific data and create appropriate displays
 */
function AOSL_specific(){
	//updateDim(height,width,volume);
}

/*
 * Create the numerical displays and graphs
 */
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

/*
 * Add a new display
 * param {String} type
 * param {String} label
 */
function createDisplay(type,label){
	if( type === 'graph'){
		addChart(label);
	}
	else if(type === 'monitor'){
		addDisplay(label);
	}
}

/*
 * Recursively extract all keys from the received JSON file
 * @param {String} json
 */
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

/*
 * Recursive helper for extractKeyPaths
 * @param {String} keypath
 * @param {String} key
 * @param {String} json
 */
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

/*
 * Take the data array and distribute it into seperate arrays that are referenced in a map
 * @param {Array} dat
 */
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

/*
 * Take a JSON array and return the leaf value found at the end of keypath
 * @param {String} keypath
 */
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



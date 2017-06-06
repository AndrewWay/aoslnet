var yearSelected="2017";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;
time_index=0;

    /*if ( ! Detector.webgl ) 
        Detector.addGetWebGLMessage();
    var container, stats;
    var camera, controls, scene, renderer;
*/

$(document).ready(function() { 
    console.log('document ready');
    var yearList = getList('/bergs/icebergyearlist');
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);
    updateMesh([],[],[]);//Render 3DMesh with no data
    updateMap(0,0);
});

function getList(url){
    console.log('requesting list from '+url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    var response = JSON.parse(request.responseText);
    console.log('database returned: '+request.responseText);
    console.log('function completing. Returning list');
    return response;
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

function changeYear(){
    console.log('changeYear() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}

function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var pcd = getJSON('/bergs/icebergpcd/'+yearSelected+'/'+bergSelected);
    var measData = getJSON('/bergs/icebergmeas/'+yearSelected+'/'+bergSelected);    

    var xdata=pcd[0].x;
    var ydata=pcd[0].y;
    var zdata=pcd[0].z;
    var height=pcd[0].height;
    var width=pcd[0].width;
    var volume=pcd[0].volume;
    var longitude=pcd[0].longitude;
    var latitude=pcd[0].latitude;
    console.log("height: "+height);
    console.log("width: "+width);
    console.log("volume: "+volume);
    console.log("longitude: "+longitude);
    console.log("latitude: "+latitude);
    console.log(typeof longitude);    
    console.log("test "+measData[0].Data[0].Picture);
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
    

    updateMesh(xdata,ydata,zdata);
    updateDim(height,width,volume);
    //updateMap(latitude,longitude);
    distributeData(measData[0].Data);
    console.log('changeIceberg() finished');
}
function distributeData(dat){
    console.log('distributeData() start');
    setSize = dat.length;
    console.log("Measurement data set size: "+setSize);
    cond=new Array(setSize);
    press=new Array(setSize);
    sal=new Array(setSize);
    svel=new Array(setSize);
    temp=new Array(setSize);
    pics=new Array(setSize);
    depth=new Array(setSize);
    lat=new Array(setSize);
    long=new Array(setSize);
    time=new Array(setSize);
    windDir=new Array(setSize);
    windSpd=new Array(setSize);
    for(i=0;i<setSize;i++){
        cond[i]=dat[i].CTD.conductivity;        
        press[i]=dat[i].CTD.pressure;        
        sal[i]=dat[i].CTD.salinity;        
        svel[i]=dat[i].CTD.soundVelocity;        
        temp[i]=dat[i].CTD.temperature;        
        pics[i]=dat[i].Picture;        
        depth[i]=dat[i].depth;        
        lat[i]=dat[i].latI0;        
        long[i]=dat[i].longI0;        
        time[i]=dat[i].timestamp;        
        windDir[i]=dat[i].longI0;        
        windSpd[i]=dat[i].timestamp;            
    }
    console.log('distributeData() finished');
}

function playback(){
    setInterval(function(){
        
    },1000*time_increment);
}
function updateDim(h,w,v){
  console.log("updateDim() running");
  console.log("h: "+h+"w: "+w+"v: "+v);
  var hTd = document.getElementById("icebergHeight");
  var wTd = document.getElementById("icebergWidth");
  var vTd = document.getElementById("icebergVolume");
  hTd.innerHTML=h;
  wTd.innerHTML=w;
  vTd.innerHTML=v;
  console.log("updateDim() done");
}

function updateGallery(){
  console.log('updateGallery() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergSelected = document.getElementById("selectIceberg").value;
}

function getJSON(url){
    console.log('getJSON() starting');
    console.log('requesting data from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);
    console.log('getJSON() finished');
    return response;
}

/*var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.200146, lng: -53.435866},
    zoom: 8
  });
}*/
//test
function updateMesh(xarr,yarr,zarr){
console.log('updateMesh() starting');
var data=[
  {
    alphahull:5,
    opacity:1,
    color:'rgb(230, 255, 255)',
    type: 'mesh3d',
    x: xarr,
    y: yarr,
    z: zarr
  }
];
// Plotting the mesh
Plotly.newPlot('iceberg_plot', data);
console.log('updateMesh() ending');
}

function displayDimensions(jsonDataReceived){

    document.getElementById("icebergHeight").innerHTML = jsonDataReceived.Dimensions.Height;
    document.getElementById("icebergWidth").innerHTML = jsonDataReceived.Dimensions.Width;
    document.getElementById("icebergVolume").innerHTML = jsonDataReceived.Dimensions.VolumeTotal;
}


function displayWind(jsonDataReceived){

    document.getElementById("minSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Min;
    document.getElementById("aveSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Average;
    document.getElementById("maxSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Max;

    document.getElementById("minDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Min;
    document.getElementById("aveDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Average;
    document.getElementById("maxDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Max;
}

//Google map
function updateMap(Ilat,Ilong) {
    mapInitialized=true;
    var uluru = {lat: Ilat, lng: Ilong};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    setMapData();      
}

// Google Maps functions
function setMapData() {
    
    //calculate average lat long
    var centerLat = 0;
    var centerLng = 0;

    for (var i = 0; i < jsonIcberg.vehiclePath.length; i++) {
        centerLat+=jsonIcberg.vehiclePath[i].lat;
        centerLng+=jsonIcberg.vehiclePath[i].lng;
        }
    centerLat/=jsonIcberg.vehiclePath.length;
    centerLng/=jsonIcberg.vehiclePath.length;
    
    
    //Init Map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: centerLat, lng: centerLng},
    mapTypeId: google.maps.MapTypeId.TERRAIN //HYBRID
  });
    
    //Set SeaDragon Path
  var seaDragonPath = new google.maps.Polyline({
    path: jsonIcberg.vehiclePath ,
    geodesic: true,
    strokeColor: '#ede900',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  seaDragonPath.setMap(map);

    // Set Iceberg Perimeter
  var IcebergPerimeter = new google.maps.Polygon({
    paths: jsonIcberg.IcebergPerimeter,
    strokeColor: '#040060',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35
  });
  IcebergPerimeter.setMap(map);   
    
    //Iceberg Drift Path
    if(jsonIcberg.IcebergDrift.length>0){
      var IcebergDriftPath = new google.maps.Polyline({
        path: jsonIcberg.IcebergDrift,
        geodesic: true,
        strokeColor: '#ff9900',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      IcebergDriftPath.setMap(map);         
    }
    
    
}

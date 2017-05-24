var yearSelected="2017";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;

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
    var bergdata = getPCD(yearSelected,bergSelected);
    var xdata=bergdata[0].x;
    var ydata=bergdata[0].y;
    var zdata=bergdata[0].z;
    updateMesh(xdata,ydata,zdata);
    console.log('changeIceberg() finished');
}

function updateGallery(){
  console.log('updateGallery() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergSelected = document.getElementById("selectIceberg").value;
  
}

function getPCD(year,name){
    console.log('getPCD() starting');
    var url='/bergs/icebergpcd/'+year+'/'+name;
    console.log('requesting PCD from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    var response = JSON.parse(request.responseText);
    console.log('database returned: '+request.responseText);
    console.log('getPCD() finished');

    return response;
}
/*var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.200146, lng: -53.435866},
    zoom: 8
  });
}*/

function updateMesh(xarr,yarr,zarr){
console.log('updateMesh() starting');
// Plotting the mesh
console.log('xdata: '+xarr);
console.log('ydata: '+yarr);
console.log('zdata: '+zarr);

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

function initMap(plat,plong) {
        mapInitialized=true;
        var uluru = {lat: jsonIcberg.Location.Latitude, lng: jsonIcberg.Location.Longitude};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
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

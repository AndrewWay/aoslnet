/**
 * @file Google Map Control
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

default_lat=60;
default_long=-45;
default_zoom=2;
mapDiv_id='map';
var AOSL_seadragon_latitude;
var AOSL_seadragon_longitude;
var map;

function AOSL_setSDCoords(lat,long){
  AOSL_seadragon_latitude=lat;
  AOSL_seadragon_longitude=long;
}
/*
 * Run once Google Map performs callback AKA is ready
 */
function mapReady() {
  map=new google.maps.Map(document.getElementById(mapDiv_id));
  setPosition(default_lat,default_long);
  setZoom(default_zoom);
}

/*
 * Set the zoom of the map
 * @param {Number} z
 * 
 */
function setZoom(z){
  map.setZoom(z);
}

/*
 * Set the position of the map
 * @param {Number} lt
 * @param {Number} lg
 * 
 */
function setPosition(lt,lg) {
  var LatLngLiteral = {lat: lt, lng: lg};  
  map.setCenter(LatLngLiteral);
}

/*
 * Create and add a new marker
 * @param {Number} lt
 * @param {Number} lg
 */
function setMarker(lt,lg){
  var LatLngLiteral = {lat: lt, lng: lg};
  var marker = new google.maps.Marker({
    position: LatLngLiteral,
    map: map
 });    
}

/*
 * update SeaDragon coordinates
 * @param {Number} lat
 * @param {Number} long
 */
function updateSDPosition(t){  
  removeSDPosition();
  if ( t < AOSL_seadragon_latitude.length && t < AOSL_seadragon_longitude.length ){
    var lat=AOSL_seadragon_latitude[t];
    var long=AOSL_seadragon_longitude[t];
    displaySDPosition(lat,long); 
  }
  else{
    console.warn('Playback attempted to access array out of bounds')
  }
}

/*
 * Display the SeaDragon marker
 * @param {Number} lat
 * @param {Number} long
 */
function displaySDPosition(lat,lng){
    var centerlat=lat;
    var centerlng=lng;
    var x=0.0002;
    var y=0.0002;
    var tri=[];
    var ax=centerlng;
    var ay=centerlat+y;
    var bx=centerlng-x;
    var by=centerlat-y;
    var cx=centerlng+x;
    var cy=centerlat-y;
    var dx=centerlng;
    var dy=centerlat+y;

    tri.push({"lat" : ay,"lng" : ax});
    tri.push({"lat" : by,"lng" : bx});
    tri.push({"lat" : cy,"lng" : cx});
    tri.push({"lat" : dy,"lng" : dx});

    sdpos = new google.maps.Polyline({
    path: tri,
    geodesic: true,
    strokeColor: '#ff0000',
    strokeOpacity: 1.0,
    strokeWeight: 1,
    zIndex: 3
  });
  sdpos.setMap(map);
}

/*
 * Remove SeaDragon symbol from map
 */
function removeSDPosition(){
  if( typeof(sdpos) !== 'undefined'){
   sdpos.setMap(null);
  }
  else{
    console.warn('Non-existent SeaDragon symbol attempting to be removed');
  }
}

/*
 * Draw the path the SeaDragon took during the survey
 */
function setSDPath(latarr,longarr){
  var perim = [];
  var i=0;
  while(i < latarr.length && i < longarr.length){
    if(typeof latarr[i] === 'number'){
      if(typeof longarr[i] === 'number'){
        perim.push({"lat" : latarr[i],"lng" : longarr[i]});       
        i++;
      }
    }
  }
  sdperimeter=new google.maps.Polyline({
    path: perim,
    strokeColor: '#f1f41d',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  });
  console.log(map);
  sdperimeter.setMap(map);  
}

function setIBPath(latarr,longarr){
  var perim = [];
  var i=0;
  while(i < latarr.length && i < longarr.length){
    if(typeof latarr[i] === 'number'){
      if(typeof longarr[i] === 'number'){
        perim.push({"lat" : latarr[i],"lng" : longarr[i]});       
        i++;
      }
    }
  }
  ibperimeter=new google.maps.Polygon({
    path: perim,
    strokeColor: '#ffffff',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35,
  });
  console.log('setting ib perimeter')
  ibperimeter.setMap(map);   
}

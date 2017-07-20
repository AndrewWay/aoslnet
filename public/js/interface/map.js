/**
 * @file Google Map Control
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

default_lat=60;
default_long=-45;
default_zoom=2;
mapDiv_id='map';
var map;

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
function updateSDPosition(lat,long){
  removeSDPosition();
  displaySDPosition(lat,long);
}

/*
 * Display the SeaDragon marker
 * @param {Number} lat
 * @param {Number} long
 */
function displaySDPosition(lat,lng){
    var centerlat=lat;
    var centerlng=lng;
    var x=0.0001;
    var y=0.0001;
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

    var sdpos = new google.maps.Polyline({
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
 * Remove SD shape from map
 */
function removeSDPosition(){
  sdpos.setMap(null);
}


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

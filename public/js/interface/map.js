//Google Map
default_lat=60;
default_long=-45;
default_zoom=2;
var map;
//Google map
function mapReady() {
  setPosition(default_lat,default_long,default_zoom);
}

function setPosition(Ilat,Ilong,zm) {
    mapInitialized=true;
    var uluru = {lat: Ilat, lng: Ilong};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zm,
        center: uluru
    });
}

function setMarker(Ilat,Ilong){
  var uluru = {lat: Ilat, lng: Ilong};
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
 });    
}

function updateSDPosition(t){
  removeSDPosition();
  displaySDPosition(0,0);
}
function displaySDPosition(lat,lng){
    var centerlat=lat;
    var centerlng=lng;
    var x=0.1;
    var y=0.1;
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
    strokeWeight: 2,
    zIndex: 3
  });
  sdpos.setMap(map);
}

function removeSDPosition(){
  sdpos.setMap(null);
}
function temporarypath(clat,clong,sdlatarr,sdlongarr,iblatarr,iblongarr){

  mapInitialized=true;
  zm=14;
  var uluru = {lat: clat, lng: clong};
  map = new google.maps.Map(document.getElementById('map'), {
   zoom: zm,
   center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });  
//CREATE SD PATH 
  var perim = [];
  var i=0;
  while(i < sdlatarr.length && i < sdlongarr.length){
    if(typeof sdlatarr[i] === 'number'){
      if(typeof sdlongarr[i] === 'number'){
        perim.push({"lat" : sdlatarr[i],"lng" : sdlongarr[i]});       
        i++;
      }
    }
  }
  sdperimeter=new google.maps.Polyline({
    path: perim,
    strokeColor: '#ff0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  });
  sdperimeter.setMap(map); 

//CREATE ICEBERG PERIMETER
  var ibperim = [];
  i=0;
  while(i < iblatarr.length && i < iblongarr.length){
    if(typeof iblatarr[i] === 'number'){
      if(typeof iblongarr[i] === 'number'){
        ibperim.push({"lat" : iblatarr[i],"lng" : iblongarr[i]});       
        i++;
      }
    }
  }
  ibperimeter=new google.maps.Polygon({
    path: ibperim,
    strokeColor: '#ffffff',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35,
  });
  console.log('setting ib perimeter')
  ibperimeter.setMap(map);   
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
    paths: perim,
    strokeColor: '#ffffff',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  });
  sdperimeter.setMap(map);  
}

function setIBPath(longarr,latarr){
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

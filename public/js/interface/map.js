//Google Map


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
}
function displayPosition(i,m){
  
}
// Google Maps functions
function setMapData() {
    console.log("Setting Map data");
    //Calculate average latitude and longitude
    var centerLat = 0;
    var centerLng = 0;
    
    var sdlg=sdlong;
    var sdlt=sdlat;    
    var ibplg=long;
    var ibplt=lat;

    var sdpath = [];
    var ibperim = [];

    //Create SeaDragon path list
    var i=0;
    while(i < sdlt.length && i < sdlg.length){
      if(typeof sdlt[i] === 'number'){
        if(typeof sdlg[i] === 'number'){
          sdpath.push({"lat" : sdlt[i],"lng" : sdlg[i]});        
          i++;
        }
      }
    }
    
    i=0;
    //Create iceberg path list
    while(i < ibplg.length && i < ibplt.length){
      if(typeof ibplt[i] === 'number'){
        if(typeof ibplg[i] === 'number'){
          ibperim.push({"lat" : ibplt[i],"lng" : ibplg[i]});
          //Calculate average perimeter longitude and latitude for map centering          
          centerLng+=ibplg[i];
          centerLat+=ibplt[i];  
          i++;  
        }
      }    
    }
 
    if (i > 0){
      centerLng/=i;
      centerLat/=i;
    }

    //Init Map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: centerLat, lng: centerLng},
    mapTypeId: google.maps.MapTypeId.TERRAIN //HYBRID
  });
    
    //Set SeaDragon Path
  var seaDragonPath = new google.maps.Polyline({
    path: sdpath,
    geodesic: true,
    strokeColor: '#ede900',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  seaDragonPath.setMap(map);

    // Set Iceberg Perimeter
  var IcebergPerimeter = new google.maps.Polygon({
    paths: ibperim,
    strokeColor: '#040060',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35
  });
  IcebergPerimeter.setMap(map);   
    
    //Iceberg Drift Path TODO
    /*if(jsonIcberg.IcebergDrift.length>0){
      var IcebergDriftPath = new google.maps.Polyline({
        path: jsonIcberg.IcebergDrift,
        geodesic: true,
        strokeColor: '#ff9900',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      IcebergDriftPath.setMap(map);         
    }*/
    console.log("Map data set");
}

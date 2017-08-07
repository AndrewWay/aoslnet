/**
 * Map Marker
 */

var Marker = new function(){

  /**
   * Create and add a new marker
   * @param {Number} lt
   * @param {Number} lg
   */
  this.createMarker = function(lt, lg) {
    var LatLngLiteral = {
lat: lt,
     lng: lg
    };
    var marker = new google.maps.Marker({
position: LatLngLiteral,
map: map
});
}

/**
 * Load the SeaDragon 
 */
this.loadObjectCoords = function(lat, long) {
  AOSL_seadragon_latitude = lat;
  AOSL_seadragon_longitude = long;
}

/**
 * Set iceberg perimeter polygon on Google Map
 */
function setIBPath(latarr, longarr) {
  var perim = [];
  var i = 0;
  while (i < latarr.length && i < longarr.length) {
    if (typeof latarr[i] === 'number') {
      if (typeof longarr[i] === 'number') {
        perim.push({
            "lat": latarr[i],
            "lng": longarr[i]
            });
        i++;
      }
    }
  }
  ibperimeter = new google.maps.Polygon({
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

/**
 * Draw the path the SeaDragon took during the survey
 */
function setSDPath(latarr, longarr) {
  var perim = [];
  var i = 0;
  while (i < latarr.length && i < longarr.length) {
    if (typeof latarr[i] === 'number') {
      if (typeof longarr[i] === 'number') {
        perim.push({
            "lat": latarr[i],
            "lng": longarr[i]
            });
        i++;
      }
    }
  }
  sdperimeter = new google.maps.Polyline({
path: perim,
strokeColor: '#f1f41d',
strokeOpacity: 0.8,
strokeWeight: 2,
});
console.log(map);
sdperimeter.setMap(map);
}

/**
 * Display the SeaDragon marker
 * @param {Number} lat
 * @param {Number} long
 */
this.displaySDMarker = function(lat, lng) {
  var centerlat = lat;
  var centerlng = lng;
  var x = 0.0002;
  var y = 0.0002;
  var tri = [];
  var ax = centerlng;
  var ay = centerlat + y;
  var bx = centerlng - x;
  var by = centerlat - y;
  var cx = centerlng + x;
  var cy = centerlat - y;
  var dx = centerlng;
  var dy = centerlat + y;

  tri.push({
      "lat": ay,
      "lng": ax
      });
  tri.push({
      "lat": by,
      "lng": bx
      });
  tri.push({
      "lat": cy,
      "lng": cx
      });
  tri.push({
      "lat": dy,
      "lng": dx
      });

  SDMarker = new google.maps.Polyline({
path: tri,
geodesic: true,
strokeColor: '#ff0000',
strokeOpacity: 1.0,
strokeWeight: 1,
zIndex: 3
});
sdpos.setMap(map);
}

}



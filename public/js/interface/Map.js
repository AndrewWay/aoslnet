/**
 * @file Google Map Control
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */
var Map = function(parentDivID){
  var default_lat = 60;
  var default_long = -45;
  var default_zoom = 2;
  var AOSL_seadragon_latitude;
  var AOSL_seadragon_longitude;
  var map = new google.maps.Map(document.getElementById(mapDiv_id));
  var SDMarker;


  /**
   * Set the zoom of the map
   * @param {Number} z
   * 
   */
  this.setMapZoom = function(z) {
    map.setZoom(z);
  }

  /**
   * Set the position of the map
   * @param {Number} lt
   * @param {Number} lg
   * 
   */
  this.setMapCenter = function(lt, lg) {
    var LatLngLiteral = {
lat: lt,
     lng: lg
    };
    map.setCenter(LatLngLiteral);
  }

  // Set to default position and zoom
  this.setMapCenter(default_lat, default_long);
  this.setMapZoom(default_zoom);


/**
 * update SeaDragon coordinates
 * @param {Number} lat
 * @param {Number} long
 */
this.updateMarker = function(t) {
  this.removeSDPosition();
  if (t < AOSL_seadragon_latitude.length && t < AOSL_seadragon_longitude.length) {
    var lat = AOSL_seadragon_latitude[t];
    var long = AOSL_seadragon_longitude[t];
    displaySDPosition(lat, long);
  }
  else {
    console.warn('Playback attempted to access array out of bounds')
  }
}


/**
 * Remove SeaDragon symbol from map
 */
this.removeMarker = function() {
  if (typeof(sdpos) !== 'undefined') {
    sdpos.setMap(null);
  }
  else {
    console.warn('Non-existent SeaDragon symbol attempting to be removed');
  }
}



}







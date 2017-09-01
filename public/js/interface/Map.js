/**
 * @constructor
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 * @param {String} parentDivID HTML ID of the div containing the Google Map
 */
var GoogleMap = function(parentDivID){
  var default_lat = 60;
  var default_long = -45;
  var default_zoom = 2;
  this.parentDivID = parentDivID;
  var AOSL_seadragon_latitude;
  var AOSL_seadragon_longitude;
  var map = new google.maps.Map(document.getElementById(this.parentDivID));
  var SDMarker;

  /**
   * Return the actual Google Map
   * @return {Object} map Map object from the google API
   */
  this.getMap = function(){
    return map;
  }
  
  /**
   * Reset the Google Map to its default settings
   * 
   */
  this.reset = function(){
    this.setZoom(default_zoom);
    this.setCenter(default_lat,default_long);
    //TODO
    // Remove all markers
    //Remove all polygons 
  }
  
  /**
   * Set the zoom of the map
   * @param {Number} z Zoom level 
   */
  this.setZoom = function(z) {
    map.setZoom(z);
  }

  /**
   * Set the position of the map
   * @param {Number} lt Latitude of the new center
   * @param {Number} lg Longitude of the new center
   * 
   */
  this.setCenter = function(lt, lg) {
    var LatLngLiteral = {
lat: lt,
     lng: lg
    };
    map.setCenter(LatLngLiteral);
  }

  // Set to default position and zoom
  this.setCenter(default_lat, default_long);
  this.setZoom(default_zoom);


/**
 * update SeaDragon
 * @param {Number} t
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







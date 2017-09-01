/**
 * @constructor
 * @param {google.Map} parentMap Map that contains the marker
 * @param {Array} latitudeArray Array containing latitude data 
 * @param {Array} longitudeArray Array containing longitude data
 */
var Marker = function(parent,latitudeArray,longitudeArray){

  this.parentMap = parent;
  var latArray = latitudeArray;
  var longArray = longitudeArray;
  var coordinateLiteral;
  var marker;
  var pathData = [];
  var path;
  var pathColor = '#f1f41d';
  
  /**
   * Set the marker
   * @param {google.maps.Marker} newMarker The new marker object 
   */
  this.setMarker = function(newMarker){
    marker = newMarker;
  }
  
  /**
   * Get the current marker
   * @return {Object} marker The current google marker
   */
  this.getMarker = function(){
    return marker;
  }
  
  /**
   * Return the latitude corresponding to index
   * @param {Number} index The index of the latitude
   * @return {Number} latArray[index] Latitude of the marker for a particular time index
   */
  this.getLatitude = function(index){
    return latArray[index];
  }
  
  /**
   * Return the longitude corresponding to index
   * @param {Number} index The index of the longitude
   * @return {Number} longArray[index] Longitude of the marker for a particular time index
   */
  this.getLongitude = function(index){
    return longArray[index];
  }
  
  /**
   * Set current position
   * @param {Number} index Time index
   */
   this.setPosition = function(index){
     var Lat = latArray[index];
     var Long = longArray[index];
     coordinateLiteral = {lat: Lat,lng: Long};
   }
   
   /**
    * Set the marker path color
    * @param {String} hexColor Hex Color for the path
    */
  this.setPathColor = function(hexColor){
    pathColor = hexColor;
  }

  /**
   * Display the marker
   */
  this.display = function(){
    marker = new google.maps.Marker({position: coordinateLiteral,map: this.parentMap});   
    marker.setMap(this.parentMap); 
  }

  /**
   * Remove marker
   */
  this.removeMarker = function(){
    marker.setMap(null);
  }

  /**
   * Set the path of the marker
   */
  this.setPath = function() {
    var i = 0;
    while (i < latArray.length && i < longArray.length) {
      if (typeof latArray[i] === 'number') {
        if (typeof longArray[i] === 'number') {
          pathData.push({
              "lat": latArray[i],
              "lng": longArray[i]
              });
          i++;
        }
      }
    }
  }

  /**
   * Add path to map
   */
  this.displayPath = function(){
    path = new google.maps.Polyline({
path: pathData,
strokeColor: pathColor,
strokeOpacity: 0.8,
strokeWeight: 2,});
    path.setMap(this.parentMap);
  }
  this.delete = function(){
    if(typeof marker !== 'undefined' && marker !== null){
      this.removeMarker();
    }
    if (typeof path !== 'undefined' && path !== null) {
      path.setMap(null);
    }
  }
  
  this.setPath(); 
  this.setPosition(0);
}







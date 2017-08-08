/**
 * @namespace
 * @param {Google Map} parentMap Map that contains the marker
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
   * @return
   */
  this.getMarker = function(){
    return marker;
  }
  /**
   * 
   */
  this.getLatitude = function(index){
    return latArray[index];
  }
  /**
   * 
   */
  this.getLongitude = function(index){
    return longArray[index];
  }
  /**
   * Set current position
   */
   this.setPosition = function(index){
     var Lat = latArray[index];
     var Long = longArray[index];
     coordinateLiteral = {lat: Lat,lng: Long};
   }
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
  this.addPath = function(){
    path = new google.maps.Polyline({
path: pathData,
strokeColor: pathColor,
strokeOpacity: 0.8,
strokeWeight: 2,});
    path.setMap(this.parentMap);
  }
  
  
  this.setPath(); 
}







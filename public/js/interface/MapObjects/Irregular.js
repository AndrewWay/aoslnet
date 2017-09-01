/**
 * Irregular Marker
 * @constructor
 * @param {Object} parentMap The map object that contains the irregular marker
 * @param {Array} latitudeArray The array that contains the latitude coordinates of each point within the polygon
 * @param {Array} longitudeArray The array that contains the longitude coordinates of each point within the polygon
 */
function IrregularMarker(parentMap,latitudeArray,longitudeArray){
  function IrregularMarkerObject() {
    this.__proto__ = new Marker(parentMap,latitudeArray,longitudeArray);
    var perim = [];
    var i = 0;
    while (i < latitudeArray.length && i < longitudeArray.length) {
      if (typeof latitudeArray[i] === 'number') {
        if (typeof longitudeArray[i] === 'number') {
          perim.push({
              "lat": latitudeArray[i],
              "lng": longitudeArray[i]
              });
          i++;
        }
      }
    }
    newMarker = new google.maps.Polygon({
path: perim,
strokeColor: '#ffffff',
strokeOpacity: 0.8,
strokeWeight: 2,
fillColor: '#3634d1',
fillOpacity: 0.35,
});

/**
 * Interfacing function with Simulation. Allows the polygon to move within the google map. 
 * @param {Number} index Time index
 */
this.play = function(index){
  //TODO
}

this.setMarker(newMarker);
newMarker.setMap(this.parentMap);
}
return new IrregularMarkerObject();
}





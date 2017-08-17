/**
 * Irregular Marker
 * @constructor
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
    var icebergPerimeter = new google.maps.Polygon({
path: perim,
strokeColor: '#ffffff',
strokeOpacity: 0.8,
strokeWeight: 2,
fillColor: '#3634d1',
fillOpacity: 0.35,
});

this.play = function(index){
//TODO
}

icebergPerimeter.setMap(this.parentMap);
}
return new IrregularMarkerObject();
}




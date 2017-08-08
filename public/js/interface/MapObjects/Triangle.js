/**
 * Triangular Marker
 */

function TriangleMarker(parentMap,latitudeArray,longitudeArray,orientationArray){
  function TriangleObject(){
    this.__proto__ = new Marker(parentMap,latitudeArray,longitudeArray);

    var x = 20;
    var y = 20;
    var icon;
    var centerlat = this.getLatitude(0);
    var centerlng = this.getLongitude(0);
    var marker;
    var iconColor = '#ffffff';
    
    
    this.orArray = orientationArray;
    var iconProps = {
      ax : centerlng,
      ay : centerlat + y,
      bx : centerlng - x,
      by : centerlat - y,
      cx : centerlng + x,
      cy : centerlat - y,
      dx : centerlng,
      dy : centerlat + y,
    }
    this.setIconColor = function(hexColor){
      iconColor = hexColor;
    }
    this.refreshIcon = function(){
      this.removeMarker();
      this.display()
    }
    /**
     * Display the SeaDragon marker
     * @param {Number} lat
     * @param {Number} long
     */
    this.display = function(lat, lng) {
      var tri = [];


      tri.push({
          "lat": iconProps.ay,
          "lng": iconProps.ax
          });
      tri.push({
          "lat": iconProps.by,
          "lng": iconProps.bx
          });
      tri.push({
          "lat": iconProps.cy,
          "lng": iconProps.cx
          });
      tri.push({
          "lat": iconProps.dy,
          "lng": iconProps.dx
          });

      marker = new google.maps.Polyline({
path: tri,
geodesic: true,
strokeColor: iconColor,
strokeOpacity: 1.0,
strokeWeight: 1,
zIndex: 3
});
marker.setMap(this.parentMap);
this.setMarker(marker);
}
}
return new TriangleObject();

}



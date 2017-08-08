/**
 * Triangular Marker
 */

function TriangleMarker(parentMap,latitudeArray,longitudeArray,orientationArray){
  function TriangleObject(){
    this.__proto__ = new Marker(parentMap,latitudeArray,longitudeArray);

    var x = 0.0002;
    var y = 0.0002;
    var icon;
    var marker;
    var iconColor = '#ffffff';
    var iconProps;
    var currentLat;
    var currentLong;
    /**
     * Interface function to be compatible with Simulation object
     */
    this.play = function(index){
      this.setPosition(index);
      this.setOrientation(index);
      this.refreshIcon();
    }
    /**
     * 
     */
    this.setOrientation = function(index){
      //Some math involving orientation heading to determine x and y
      //TODO
      var currentLat = this.getLatitude(index);
      var currentLong = this.getLongitude(index);
      
      iconProps = {
ax : currentLong,
     ay : currentLat + y,
     bx : currentLong - x,
     by : currentLat - y,
     cx : currentLong + x,
     cy : currentLat - y,
     dx : currentLong,
     dy : currentLat + y,
      }
    }
    /*this.setPosition = function(index){
      currentLat = this.getLatitude(index);
      currentLong = this.getLongitude(index);
    }*/
    this.orArray = orientationArray;

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

this.setPosition(0);
this.setOrientation(0);
this.display();
}
return new TriangleObject();

}




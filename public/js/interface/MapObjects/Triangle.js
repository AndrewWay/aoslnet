/**
 * @constructor
 * 
 * TriangularMarker
 * @param {Object} parentMap Map that contains the triangle marker
 * @param {Array} latitudeArray Array that contains the triangle latitude coordinates
 * @param {Array} longitudeArray Array that contains the triangle longitude coordinates
 * @param {Array} orientation Array that contains the triangle orientations
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
     * @param {Number} index The index of the data
     */
    this.play = function(index){
      this.setPosition(index);
      this.setOrientation(index);
      this.refreshIcon();
    }
    
    /**
     * Set the orientation of the triangle marker
     * @param {Number} index The index of the data
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
    this.display = function() {
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
strokeWeight: 4,
zIndex: 3
});
marker.setMap(this.parentMap);
this.setMarker(marker);
console.log("HELLO");
}

this.setPosition(0);
this.setOrientation(0);
this.display();
}
return new TriangleObject();

}




/**
 * Irregular Marker
 */
 
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

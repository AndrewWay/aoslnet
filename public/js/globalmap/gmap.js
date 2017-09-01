/**
 * @file gmap.js Data Map
 */

var selectedID="";
var selectedYear="";
var lat=[];
var long=[];
var id=[];
var year=[];
var iq=0;

/**
 * Run all functions necessary for loading of page
 */
function setup() {
    var yearList = getJSON('/bergs/years');
    console.log(yearList);    
    console.log("Hello?");
    for(i=0;i<yearList.length;i++){
      var yearSelected = parseInt(yearList[i]);
      var bergList = getJSON('/bergs/names/'+yearSelected);
      console.log("Berglist "+bergList);
      for(j=0;j<bergList.length;j++){
        bergSelected = bergList[j]; //Get the name of the iceberg        
        var dat = getJSON('/bergs/data/'+yearSelected+'/'+bergSelected);//Get iceberg data
        if(dat.length > 0){
          console.log("adding iceberg");
          distributeData(dat);//Add data to the global array
          addMarker(iq);//Add an iceberg marker to the map       
          iq++;//Increment the iceberg quantity      
        }
        else{
          console.log("Measurement array for "+bergSelected+" is empty. Not adding marker to map.");
        }
              
      } 
    }
  console.log(lat);
  console.log(long);
}

/**
 * Route to data viewer page
 */
function view(){
  console.log("selected: "+selectedYear+" "+selectedID);
  sessionStorage.setItem('selectedID', selectedID);
  sessionStorage.setItem('selectedYear', selectedYear);
  console.log("redirecting to interface");
   window.location.href = '/interface'
}


/**
 * Distribute data obtained from database into various arrays
 */
function distributeData(dat){
  console.log("distributing data...");  
  var lt=dat[0].latitude;//Im not even sure why I'm accessing the JSON like an array. 
  var lg=dat[0].longitude;
  var yr=dat[0].year;
  var nm=dat[0].name;

  lat.push(lt);        
  long.push(lg);  
  year.push(yr);
  id.push(nm);
  console.log("data distributed.");
}

/**
 * Add a new marker into the map
 */
function addMarker(i){
  console.log("adding marker...");
  var lt = parseFloat(lat[i]);
  var lg = parseFloat(long[i]);  
  var nm = id[i];
  var yr = year[i];
  var coord = {lat: lt,lng: lg};
  //Create a new google marker
  var marker = new google.maps.Marker({
    position: coord,
    map: map,
    title: nm
  });
  //Add a new google marker to the map
  marker.setMap(map); 

  google.maps.event.addListener(marker, 'click', function() {
    document.getElementById('desc').innerHTML='NAME: '+nm+' YEAR: '+yr+' LATITUDE: '+lt+' LONGITUDE: '+lg+' DESCRIPTION: [sometext]';
    selectedID=nm;
    selectedYear=yr;
    setCookie("Name", id[i] , 365);
    setCookie("Year", year[i], 365);
  });

  console.log("marker added for: "+nm);
}

/**
 * Set a cookie for use throughout the site. 
 */
function setCookie(c_name, value, exdays)
{
  // Note that clicking a marker sets a cookie with the name and year for the corresponding iceberg.
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + 
    ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

/**
 * Initialize the map when ready
 */
function mapReady() {
  console.log("initializing map...");

  var centerLat = 0;
  var centerLng = 0;

  //Initialize Map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: centerLat, lng: centerLng},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  console.log("map initialized.");
  
  setup();
}

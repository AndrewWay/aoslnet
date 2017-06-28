selectedID="";
selectedYear="";
lat=[];
long=[];
id=[];
year=[];
iq=0;

function setup() {
    var yearList = getList('/bergs/years');
    console.log(yearList);    
    console.log("Hello?");
    for(i=0;i<yearList.length;i++){
      var yearSelected = parseInt(yearList[i]);
      var bergList = getList('/bergs/names/'+yearSelected);
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

function view(){
  console.log("selected: "+selectedYear+" "+selectedID);
  sessionStorage.setItem('selectedID', selectedID);
  sessionStorage.setItem('selectedYear', selectedYear);
  console.log("redirecting to interface");
   window.location.href = '/interface'
}

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
    document.getElementById('desc').innerHTML=nm+' was clicked';
    selectedID=nm;
    selectedYear=yr;
  });
  console.log("marker added for: "+nm);
}

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

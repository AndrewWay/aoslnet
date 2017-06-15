var yearSelected="2017";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;
tmax=0;
time_index=0;
disp_size=20;
delay_factor=0.5;
playid=0;
cond=[];
press=[];
sal=[];
svel=[];
temp=[];
pics=[];
depth=[];
lat=[];
long=[];
time=[];
windDir=[];
windSpd=[];
sdlat=[];
sdlong=[];

    /*if ( ! Detector.webgl ) 
        Detector.addGetWebGLMessage();
    var container, stats;
    var camera, controls, scene, renderer;
*/

$(document).ready(function() { 
    document.getElementById("pausebtn").disabled=true;
    document.getElementById("stopbtn").disabled=true;
    console.log('document ready');
    var yearList = getList('/bergs/icebergyearlist');
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);
    updateMesh([],[],[]);//Render 3DMesh with no data
    updateMap(0,0);
});

function getList(url){
    console.log('requesting list from '+url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    var response = JSON.parse(request.responseText);
    console.log('database returned: '+request.responseText);
    console.log('function completing. Returning list');
    return response;
}

function updateOptions(optionID,options){
    var optList = document.getElementById(optionID); 
    //Remove existing options from option list    
    while (optList.firstChild) {
        optList.removeChild(optList.firstChild);
    }
    //Append new options to option list
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.text = options[i];
        option.value= options[i];
        optList.add(option);
    }
}

function changeYear(){
    console.log('changeYear() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}

function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var pcd = getJSON('/bergs/icebergpcd/'+yearSelected+'/'+bergSelected);
    var measData = getJSON('/bergs/icebergmeas/'+yearSelected+'/'+bergSelected);    

    var xdata=pcd[0].x;
    var ydata=pcd[0].y;
    var zdata=pcd[0].z;
    var height=pcd[0].height;
    var width=pcd[0].width;
    var volume=pcd[0].volume;
    var longitude=pcd[0].longitude;
    var latitude=pcd[0].latitude;
    console.log("height: "+height);
    console.log("width: "+width);
    console.log("volume: "+volume);
    console.log("longitude: "+longitude);
    console.log("latitude: "+latitude);
    console.log(typeof longitude);    

    if(typeof longitude === 'number'){
      if(!(longitude>=-180 && longitude <= 180)){
        console.log("longitude invalid: out of range.");
        longitude=0;
      }
    }
    else{
      console.log("longitude invalid: not of type 'number'")
      longitude=0;    
    }
    if(typeof latitude === 'number'){
      if(!(latitude>=-90 && latitude <= 90)){
        console.log("latitude invalid: out of range.");
        latitude=0;
      }
    }
    else{
      console.log("latitude invalid: not of type 'number'")
      latitude=0;    
    }
    updateMesh(xdata,ydata,zdata);
    updateDim(height,width,volume);
    distributeData(measData[0].Data);
    displayWind(windSpd,windDir);
    updateMap(latitude,longitude);
    setMapData();  
    updateTimeMax(measData[0].Data.length);
    console.log('changeIceberg() finished');
}

function updateTimeMax(t){
  tmax=t;
  console.log("Setting timebar max to "+tmax);
  document.getElementById("timebar").max=tmax;
}
function distributeData(dat){
    console.log('distributeData() start');
    setSize = dat.length;
    console.log("Measurement data set size: "+setSize);
    cond=new Array(setSize);
    press=new Array(setSize);
    sal=new Array(setSize);
    svel=new Array(setSize);
    temp=new Array(setSize);
    pics=new Array(setSize);
    depth=new Array(setSize);
    lat=new Array(setSize);
    long=new Array(setSize);
    sdlat=new Array(setSize);
    sdlong=new Array(setSize);
    time=new Array(setSize);
    windDir=new Array(setSize);
    windSpd=new Array(setSize);
    for(i=0;i<setSize;i++){
        cond[i]=dat[i].CTD.conductivity;        
        press[i]=dat[i].CTD.pressure;        
        sal[i]=dat[i].CTD.salinity;        
        svel[i]=dat[i].CTD.soundVelocity;        
        temp[i]=dat[i].CTD.temperature;        
        pics[i]=dat[i].Picture;        
        depth[i]=dat[i].depth;        
        lat[i]=dat[i].latI0;        
        long[i]=dat[i].longI0;        
      //  time[i]=dat[i].adcp.timestamps;//Fix this. JSON objects have bad timestamp data
        windDir[i]=dat[i].windDir;        
        windSpd[i]=dat[i].windSpd;      
        sdlat[i]=dat[i].latitudeSD;
        sdlong[i]=dat[i].longitudeSD;      
    }
    console.log('distributeData() finished');
}

function download(){
    console.log("download() starting");
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var url='download/'+yearSelected+'/'+bergSelected+'/'+yearSelected+'_'+bergSelected+'.gz';
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    console.log('download() finished');
}

function play(){      
    document.getElementById("pausebtn").disabled=false;
    document.getElementById("stopbtn").disabled=false;
    document.getElementById("playbtn").disabled=true;

    playid=setInterval(function(){
        var c = cond[time_index];
        var t = temp[time_index];
        var d = depth[time_index];
        var ti = time_index;//time[time_index];//Json objects have bad timestamp data
        redraw(c,t,d,ti);
        var ws=windSpd[time_index];
        var wd=windDir[time_index];        
        var p = pics[time_index];        
        updateWind(ws,wd);
        updatePic(p);
        setTimeBar(time_index);        
        
        setTime(time_index+1);
        if(time_index>cond.length){
          clearInterval(playid);
        }
    },1000*delay_factor);
}
function manualsetTime(){
  var newTime=document.getElementById("timebar").value;
  console.log("Manually setting time to: "+newTime);
  time_index=newTime;
}
function setTime(t){
  time_index=t;
}
function setTimeBar(t){
  document.getElementById("timebar").value=t;
}
function pause(){
  clearInterval(playid);
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}

function stop(){
  clearInterval(playid);
  setTime(0);
  setTimeBar(time_index);
  setupChart();
  document.getElementById("stopbtn").disabled=true;
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}

function updatePic(p){
  console.log('updatePic()');
  console.log('pic: '+p);
  if(!(p === 'null')){
    document.getElementById("icedisp").src="../images/2017/Joey/"+p;
    $("#icedisp").on("error", function(){
        $(this).attr('src', 'images/notfound.png');
    });
  }
}

function updateDim(h,w,v){
  console.log("updateDim() running");
  console.log("h: "+h+"w: "+w+"v: "+v);
  var hTd = document.getElementById("icebergHeight");
  var wTd = document.getElementById("icebergWidth");
  var vTd = document.getElementById("icebergVolume");
  hTd.innerHTML=h;
  wTd.innerHTML=w;
  vTd.innerHTML=v;
  console.log("updateDim() done");
}

function updateGallery(){
  console.log('updateGallery() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergSelected = document.getElementById("selectIceberg").value;
}

function getJSON(url){
    console.log('getJSON() starting');
    console.log('requesting data from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);
    console.log('getJSON() finished');
    return response;
}

/*var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.200146, lng: -53.435866},
    zoom: 8
  });
}*/
//test
function updateMesh(xarr,yarr,zarr){
console.log('updateMesh() starting');
var data=[
  {
    alphahull:5,
    opacity:1,
    color:'rgb(230, 255, 255)',
    type: 'mesh3d',
    x: xarr,
    y: yarr,
    z: zarr
  }
];
// Plotting the mesh
Plotly.newPlot('iceberg_plot', data);
console.log('updateMesh() ending');
}

function displayDimensions(jsonDataReceived){

    document.getElementById("icebergHeight").innerHTML = jsonDataReceived.Dimensions.Height;
    document.getElementById("icebergWidth").innerHTML = jsonDataReceived.Dimensions.Width;
    document.getElementById("icebergVolume").innerHTML = jsonDataReceived.Dimensions.VolumeTotal;
}

function updateWind(wD,wS){
    if(typeof wD === 'number'){
       document.getElementById("curSpeedWind").innerHTML = wD; 
    }
    else{
      document.getElementById("curSpeedWind").innerHTML = "-"; 
    }
    if(typeof wS === 'number'){
       document.getElementById("curDirWind").innerHTML = wS;   
    }
    else{
      document.getElementById("curDirWind").innerHTML = "-"; 
    }
}

function displayWind(wd,ws){
    console.log("displaying wind");
    var sAve=0;    
    var sMin=Math.min.apply(Math,ws);
    var sMax=Math.max.apply(Math,ws);
    var div=1;
    for(i=0;i<ws.length;i++){
        if(typeof ws[i] === 'number'){
          sAve+=parseFloat(ws[i]);            
          div++;        
        }
    }    
    sAve=sAve/div;

    var dAve=0;
    var dMin=Math.min.apply(Math,wd);
    var dMax=Math.max.apply(Math,wd);
    var div=1;
    for(i=0;i<wd.length;i++){
         if(typeof ws[i] === 'number'){
          dAve+=parseFloat(wd[i]);           
          div++;        
        }
    }    
    dAve=dAve/div;

    document.getElementById("minSpeedWind").innerHTML = sMin;
    document.getElementById("aveSpeedWind").innerHTML = sAve;
    document.getElementById("maxSpeedWind").innerHTML = sMax;

    document.getElementById("minDirWind").innerHTML = dMin;
    document.getElementById("aveDirWind").innerHTML = dAve;
    document.getElementById("maxDirWind").innerHTML = dMax;
}

//Google map
function updateMap(Ilat,Ilong) {
    mapInitialized=true;
    var uluru = {lat: Ilat, lng: Ilong};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });    
}
function displayPosition(i,m){
  
}
// Google Maps functions
function setMapData() {
    console.log("Setting Map data");
    //Calculate average latitude and longitude
    var centerLat = 0;
    var centerLng = 0;
    
    var sdlg=sdlong;
    var sdlt=sdlat;    
    var ibplg=long;
    var ibplt=lat;

    var sdpath = [];
    var ibperim = [];

    //Create SeaDragon path list
    var i=0;
    while(i < sdlt.length && i < sdlg.length){
      if(typeof sdlt[i] === 'number'){
        if(typeof sdlg[i] === 'number'){
          sdpath.push({"lat" : sdlt[i],"lng" : sdlg[i]});        
          i++;
        }
      }
    }
    
    i=0;
    //Create iceberg path list
    while(i < ibplg.length && i < ibplt.length){
      if(typeof ibplt[i] === 'number'){
        if(typeof ibplg[i] === 'number'){
          ibperim.push({"lat" : ibplt[i],"lng" : ibplg[i]});
          //Calculate average perimeter longitude and latitude for map centering          
          centerLng+=ibplg[i];
          centerLat+=ibplt[i];  
          i++;  
        }
      }    
    }
 
    if (i > 0){
      centerLng/=i;
      centerLat/=i;
    }

    //Init Map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: centerLat, lng: centerLng},
    mapTypeId: google.maps.MapTypeId.TERRAIN //HYBRID
  });
    
    //Set SeaDragon Path
  var seaDragonPath = new google.maps.Polyline({
    path: sdpath,
    geodesic: true,
    strokeColor: '#ede900',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  seaDragonPath.setMap(map);

    // Set Iceberg Perimeter
  var IcebergPerimeter = new google.maps.Polygon({
    paths: ibperim,
    strokeColor: '#040060',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35
  });
  IcebergPerimeter.setMap(map);   
    
    //Iceberg Drift Path TODO
    /*if(jsonIcberg.IcebergDrift.length>0){
      var IcebergDriftPath = new google.maps.Polyline({
        path: jsonIcberg.IcebergDrift,
        geodesic: true,
        strokeColor: '#ff9900',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      IcebergDriftPath.setMap(map);         
    }*/
    console.log("Map data set");
}

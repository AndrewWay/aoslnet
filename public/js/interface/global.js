var yearSelected="";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;

//strings for making data requests
namesReq='bergs/names';
yearsReq='bergs/years';
dataReq='bergs/data';

tmax=0;
disp_size=20;
playid=0;
pics=[];
time=[];

//Geometric Data
sdlat=[];
sdlong=[];
lat=[];
long=[];
centerlong=0;
centerlat=0;

//Oceanic data
sal=[];
svel=[];
depth=[];
temp=[];
cond=[];
press=[];

//Atmospheric Data
windDir=[];
windSpd=[];
airTemp=[];
airPress=[];

$(document).ready(function() { 
    document.getElementById("pausebtn").disabled=true;
    document.getElementById("stopbtn").disabled=true;
    console.log('document ready');
    var yearList = getList(yearsReq);
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);
    updateMesh('');//Render 3DMesh with no data
   // preselect();
});

function preselect(){
  var selectedID=sessionStorage.getItem('selectedID');
  var selectedYear=sessionStorage.getItem('selectedYear');
  //TODO: Clean up the if condition. Too long. 
  //TODO: Use regular expressions to detect valid names and years
  if( selectedID == 'null' || selectedID == '' || selectedYear == '' || selectedYear == 'null'){
    console.log("No pre-selected iceberg");
  }
  else{
    console.log("pre-selected iceberg: "+selectedYear+" "+selectedID );
    document.getElementById('selectYear').value=selectedYear;
    document.getElementById('selectIceberg').value=selectedID;  
  }
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
    var bergList = getList(namesReq+'/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}

function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var json = getJSON(dataReq+'/'+yearSelected+'/'+bergSelected);  

    var xdata=json[0].x;
    var ydata=json[0].y;
    var zdata=json[0].z;
    var height=json[0].height;
    var width=json[0].width;
    var volume=json[0].volume;
    var longitude=json[0].longitude;
    var latitude=json[0].latitude;
    centerlong=longitude;
    centerlat=latitude;
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
    //updateMesh('');
    updateDim(height,width,volume);
    distributeData(json[0].Data);
    displayWind(windSpd,windDir);
    updateMap(latitude,longitude);
    setMapData();  
    updateTimeMax(json[0].Data.length);
    console.log('changeIceberg() finished');
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
    airPress=new Array(setSize);
    airTemp=new Array(setSize);
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
        time[i]=dat[i].timestamp;//Fix this. JSON objects have bad timestamp data
        windDir[i]=dat[i].windDir;        
        windSpd[i]=dat[i].windSpd;      
        sdlat[i]=dat[i].latitudeSD;
        sdlong[i]=dat[i].longitudeSD;  
        airPress[i]=dat[i].pressure;
        airTemp[i]=dat[i].temperature;    
    }
    setplotData(sal,temp,depth,time);
    console.log('distributeData() finished');
}

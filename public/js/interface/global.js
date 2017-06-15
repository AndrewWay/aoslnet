var yearSelected="2017";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;
tmax=0;
disp_size=20;
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
    setMapData();
    updateMap(0,0);
});

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
    setplotData(sal,temp,depth,time);
    console.log('distributeData() finished');
}

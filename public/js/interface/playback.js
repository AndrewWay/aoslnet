//Data playback

var Simulation = function(){

var time_index=0;
var delay_factor=1;
this.timebarid='timebar';
this.playbtnid='playbtn';
this.pausebtnid='pausebtn';
this.stopbtnid='stopbtn';
this.sdx=[];
this.sdy=[];

/* PUBLIC FUNCTIONS */

/**
 * Set the time index based on the current value of the slider bar
 */
this.manualsetTime = function(){
  //TODO Have play and manualsetTime call the same single function for updating all data/positions/etc
  var newTime=document.getElementById(timebarid).value;
  console.log("Manually setting time to: "+newTime);
  set_time(newTime);  
  dispdata(this.get_time());
};

/**
 * 
 */
this.play = function(){      
    document.getElementById(this.pausebtnid).disabled=false;
    document.getElementById(this.stopbtnid).disabled=false;
    document.getElementById(this.playbtnid).disabled=true;
    document.getElementById(this.timebarid).disabled=false;
    var parent = this;
    playid=setInterval(function(){
        var ti = parent.get_time();//time[time_index];//Json objects have bad timestamp data
        console.log('time: '+ti+' sdx: '+parent.sdx[ti]+' sdy: '+parent.sdy[ti]);        
        parent.dispdata(ti);
        parent.setTimeBar(ti);
        setSDModelPosition(parent.sdx[ti],parent.sdy[ti],SDBottom);        
        parent.set_time(ti+1);
        if(ti>time.length){
          clearInterval(parent.playid);
        }
    },1000*parent.delay_factor);
};

/*
 * Convert SeaDragon latitude and longitude to point cloud local frame
 */
this.setSD = function(x,y,gps_origin){
  var xorigin=gps_origin[0];
  var yorigin=gps_origin[1];
  console.log(yorigin);
  var xorigin_m=lat2m(xorigin);
  var yorigin_m=long2m(yorigin);
  console.log(yorigin_m);
  console.log('Converting gps to local');
  console.log(x);
  console.log(y);
      // Convert xy coordinates to metres and relative to local frame
  for(i=0;i<x.length;i++){
    x[i]=lat2m(x[i]) - xorigin_m;
    y[i]=long2m(y[i]) - yorigin_m; 
  }
  sdx=x;
  sdy=y;
};
this.pause = function(){
  clearInterval(this.playid);
  document.getElementById(this.timebarid).disabled=false;
  document.getElementById(this.pausebtnid).disabled=true;
  document.getElementById(this.playbtnid).disabled=false;
};

this.stop = function(){
  clearInterval(this.playid);
  set_time(0);
  setTimeBar(this.get_time());
  dispdata(this.get_time());
  document.getElementById(timebarid).disabled=false;
  document.getElementById(stopbtnid).disabled=true;
  document.getElementById(pausebtnid).disabled=true;
  document.getElementById(playbtnid).disabled=false;
};

this.updateTimeMax = function(t){
  tmax=t;
  document.getElementById(this.timebarid).max=tmax;
};

this.get_time = function(){
  return parseInt(time_index); 
};

this.dispdata = function(t){
  redraw(t);
  redisplay(t);
  updateSDPosition(t)
};

/* PRIVATE FUNCTIONS */

var lat2m = function(phi){
  return 111132.92-559.82*Math.cos(2*phi)+1.175*Math.cos(4*phi)-0.0023*Math.cos(6*phi);
};
var long2m = function(theta){
  return 111412.84*Math.cos(theta)-93.5*Math.cos(3*theta)+0.118*Math.cos(5*theta);
};

var setclock = function(t){
  var date = new Date(time[t]*1000);
  var hours = date.getHours();// Hours part from the timestamp
  var minutes = "0" + date.getMinutes();// Minutes part from the timestamp
  var seconds = "0" + date.getSeconds();// Seconds part from the timestamp
  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  document.getElementById(clockid).innerHTML=formattedTime;
};
var set_time = function(t){
  time_index=t;
};
var setTimeBar = function(t){
  document.getElementById(timebarid).value=t;
};

};

//Data playback
time_index=0;
delay_factor=1;
timebarid='timebar';
playbtnid='playbtn';
pausebtnid='pausebtn';
stopbtnid='stopbtn';
sdx=[];
sdy=[];

//TODO Have play and manualsetTime call the same single function for updating all data/positions/etc

function manualsetTime(){
  var newTime=document.getElementById(timebarid).value;
  console.log("Manually setting time to: "+newTime);
  set_time(newTime);  
  dispdata(get_time());
}

function play(){      
    document.getElementById(pausebtnid).disabled=false;
    document.getElementById(stopbtnid).disabled=false;
    document.getElementById(playbtnid).disabled=true;
    document.getElementById(timebarid).disabled=false;
    playid=setInterval(function(){
        var ti = get_time();//time[time_index];//Json objects have bad timestamp data
       // console.log('time: '+ti+' sdx: '+sdx[ti]+' sdy: '+sdy[ti]);        
        dispdata(ti);
        setTimeBar(ti);
       // setSDModelPosition(sdx[ti],sdy[ti],SDBottom);        
        set_time(ti+1);
        if(ti>time.length){
          clearInterval(playid);
        }
    },1000*delay_factor);
}

/*
 * Convert SeaDragon latitude and longitude to point cloud local frame
 */
function setSD(x,y,gps_origin){
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
}

function lat2m(phi){
  return 111132.92-559.82*Math.cos(2*phi)+1.175*Math.cos(4*phi)-0.0023*Math.cos(6*phi);
}
function long2m(theta){
  return 111412.84*Math.cos(theta)-93.5*Math.cos(3*theta)+0.118*Math.cos(5*theta);
}

function dispdata(t){
  redraw(t);
  redisplay(t);
 // updateSDPosition(t)
}

function pause(){
  clearInterval(playid);
  document.getElementById(timebarid).disabled=false;
  document.getElementById(pausebtnid).disabled=true;
  document.getElementById(playbtnid).disabled=false;
}

function stop(){
  clearInterval(playid);
  set_time(0);
  setTimeBar(get_time());
  dispdata(get_time());
  document.getElementById(timebarid).disabled=false;
  document.getElementById(stopbtnid).disabled=true;
  document.getElementById(pausebtnid).disabled=true;
  document.getElementById(playbtnid).disabled=false;
}
function setclock(t){
  var date = new Date(time[t]*1000);
  var hours = date.getHours();// Hours part from the timestamp
  var minutes = "0" + date.getMinutes();// Minutes part from the timestamp
  var seconds = "0" + date.getSeconds();// Seconds part from the timestamp

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  document.getElementById(clockid).innerHTML=formattedTime;
}
function set_time(t){
  time_index=t;
}
function get_time(){
  return parseInt(time_index); 
}
function setTimeBar(t){
  document.getElementById(timebarid).value=t;
}
function updateTimeMax(t){
  tmax=t;
  document.getElementById(timebarid).max=tmax;
}

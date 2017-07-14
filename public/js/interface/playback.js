//Trial playback
time_index=0;
delay_factor=0.5;

function manualsetTime(){
  var newTime=document.getElementById("timebar").value;
  console.log("Manually setting time to: "+newTime);
  set_time(newTime);  
  dispdata(get_time());
}
function play(){      
    document.getElementById("pausebtn").disabled=false;
    document.getElementById("stopbtn").disabled=false;
    document.getElementById("playbtn").disabled=true;
    document.getElementById("timebar").disabled=true;
    playid=setInterval(function(){
        var ti = get_time();//time[time_index];//Json objects have bad timestamp data
        console.log('time: '+ti);        
        dispdata(ti);
        setTimeBar(ti);        
        set_time(ti+1);
        if(ti>time.length){
          clearInterval(playid);
        }
    },1000*delay_factor);
}

function dispdata(t){
  redraw(t);
  var ws=windSpd[t];
  var wd=windDir[t];        
  var p = pics[t];  
  var ap=airPress[t];
  var at=airTemp[t];
  var sv=svel[t];      
  updateWind(ws,wd);
  updatePic(p);
  updateSDPosition(t);
  updateSvel(sv);
  updateAir(ap,at);
  setclock(t);
}

function pause(){
  clearInterval(playid);
  document.getElementById("timebar").disabled=false;
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}

function stop(){
  clearInterval(playid);
  set_time(0);
  setTimeBar(get_time());
  dispdata(get_time());
  document.getElementById("timebar").disabled=false;
  document.getElementById("stopbtn").disabled=true;
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}
function setclock(t){
  var date = new Date(time[t]*1000);

  var hours = date.getHours();// Hours part from the timestamp
  var minutes = "0" + date.getMinutes();// Minutes part from the timestamp
  var seconds = "0" + date.getSeconds();// Seconds part from the timestamp

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  document.getElementById("clock").innerHTML=formattedTime;
}
function updateSvel(sv){
  document.getElementById("soundvel").innerHTML=sv;
}
function updateAir(ap,at){
  document.getElementById("airpress").innerHTML=ap;
  document.getElementById("airtemp").innerHTML=at;    
}
function set_time(t){
  time_index=t;
}
function get_time(){
  return parseInt(time_index); 
}
function setTimeBar(t){
  document.getElementById("timebar").value=t;
}
function updateTimeMax(t){
  tmax=t;
  console.log("Setting timebar max to "+tmax);
  document.getElementById("timebar").max=tmax;
}

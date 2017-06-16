//Trial playback
time_index=0;
delay_factor=0.5;

function manualsetTime(){
  var newTime=document.getElementById("timebar").value;
  console.log("Manually setting time to: "+newTime);
  set_time(newTime);  
  redraw(get_time());
  updatePic(pics[get_time()]);
}
function set_time(t){
  time_index=t;
  var date = new Date(time[time_index]*1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  var ap=airPress[get_time()];
  var at=airTemp[get_time()];
  var sv=svel[get_time()];

  document.getElementById("clock").innerHTML=formattedTime;
  document.getElementById("soundvel").innerHTML=sv;
  document.getElementById("airpress").innerHTML=ap;
  document.getElementById("airtemp").innerHTML=at;  
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

function play(){      
    document.getElementById("pausebtn").disabled=false;
    document.getElementById("stopbtn").disabled=false;
    document.getElementById("playbtn").disabled=true;
    document.getElementById("timebar").disabled=true;
    playid=setInterval(function(){
        var ti = get_time();//time[time_index];//Json objects have bad timestamp data
        console.log('time: '+ti);        
        redraw(ti);
        var ws=windSpd[ti];
        var wd=windDir[ti];        
        var p = pics[ti];        
        updateWind(ws,wd);
        updatePic(p);
        setTimeBar(ti);        
        
        set_time(ti+1);
        if(ti>time.length){
          clearInterval(playid);
        }
    },1000*delay_factor);
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
  redraw(get_time());
  document.getElementById("timebar").disabled=false;
  document.getElementById("stopbtn").disabled=true;
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}


//Data playback
time_index=0;
delay_factor=1;
timebarid='timebar';
playbtnid='playbtn';
pausebtnid='pausebtn';
stopbtnid='stopbtn';

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
  redisplay(t);
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

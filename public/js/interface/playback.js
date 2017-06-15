//Trial playback
time_index=0;

function manualsetTime(){
  var newTime=document.getElementById("timebar").value;
  console.log("Manually setting time to: "+newTime);
  setime(newTime);  
  redraw(time_index);
}
function setime(t){
  time_index=t;
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
        var c = cond[time_index];
        var t = temp[time_index];
        var d = depth[time_index];
        var ti = time_index;//time[time_index];//Json objects have bad timestamp data
        redraw(ti);
        var ws=windSpd[ti];
        var wd=windDir[ti];        
        var p = pics[ti];        
        updateWind(ws,wd);
        updatePic(p);
        setTimeBar(ti);        
        
        setime(ti+1);
        if(time_index>cond.length){
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
  setTime(0);
  setTimeBar(time_index);
  setupChart();
  document.getElementById("timebar").disabled=false;
  document.getElementById("stopbtn").disabled=true;
  document.getElementById("pausebtn").disabled=true;
  document.getElementById("playbtn").disabled=false;
}


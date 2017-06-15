//Trial playback

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
function updateTimeMax(t){
  tmax=t;
  console.log("Setting timebar max to "+tmax);
  document.getElementById("timebar").max=tmax;
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


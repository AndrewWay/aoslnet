//Air stats

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


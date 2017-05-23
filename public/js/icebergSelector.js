var yearSelected="2017";
var icebergSelected="";
var filepathIcebergsData = "";
var filePathIcebergSelected="";
var filepathIcebergModel="";
var IcebergModelName="";
var jsonIcberg ={};
var mapInitialized=false;

    if ( ! Detector.webgl ) 
        Detector.addGetWebGLMessage();
    var container, stats;
    var camera, controls, scene, renderer;


$(document).ready(function() { 
    console.log('document ready');
    var yearList = getList('/bergs/icebergyearlist');
    updateOptions('selectYear',yearList);
    var yearSelected = document.getElementById("selectYear").value;
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);
});
function getList(url){
    console.log('requesting list from '+url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    var response = JSON.parse(request.responseText);
    console.log('database returned: '+request.responseText);
    console.log('function completing. Returning list');

    return response;
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
    var bergList = getList('/bergs/icebergnamelist/'+yearSelected);
    updateOptions('selectIceberg',bergList);  
    console.log('changeYear() finished');
}
function changeIceberg(){
    console.log('changeIceberg() starting');
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var bergdata = getPCD(yearSelected,bergSelected);
    var xdata=bergdata[0].x;
    var ydata=bergdata[0].y;
    var zdata=bergdata[0].z;

    updateMesh(xdata,ydata,zdata);
    console.log('changeIceberg() finished');
}

function getPCD(year,name){
    console.log('getPCD() starting');
    var url='/bergs/icebergpcd/'+year+'/'+name;
    console.log('requesting PCD from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    var response = JSON.parse(request.responseText);
    console.log('database returned: '+request.responseText);
    console.log('getPCD() finished');

    return response;
}
/*var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.200146, lng: -53.435866},
    zoom: 8
  });
}*/

function updateMesh(xarr,yarr,zarr){
console.log('updateMesh() starting');
// Plotting the mesh
console.log('xdata: '+xarr);
console.log('ydata: '+yarr);
console.log('zdata: '+zarr);

var data=[
  {
    alphahull:5,
    opacity:0.8,
    color:'rgb(200,100,300)',
    type: 'mesh3d',
    x: xarr,
    y: yarr,
    z: zarr,
  }
];

Plotly.newPlot('iceberg_plot', data);
console.log('updateMesh() ending');
}
function changeIceberg2() {
    console.log('selectIceberg()');
    icebergSelected = document.getElementById("selectIcebergs").value;
    if(yearSelected != ""){
        //document.getElementById("icebergSelected").text = filePathIcebergSelected;
        var request = new XMLHttpRequest();
        request.open("GET", "/bergs/icebergyearlist/"+yearSelected, false);
        request.send(null);
        jsonIcberg = JSON.parse(request.responseText);
        document.getElementById("json_data").innerHTML=JSON.stringify(jsonIcberg, null, 4);
        console.log(jsonIcberg);

        var x = document.getElementById("selectModel");
        while (x.firstChild) {
            x.removeChild(x.firstChild);
        }
        for (var i = 0; i < jsonIcberg.Models.length; i++) {
            var option = document.createElement("option");
            option.text = jsonIcberg.Models[i];
            option.value=option.text;
            x.add(option);
        }
        
        x = document.getElementById("imagesIceberg");
        while (x.firstChild) {
            x.removeChild(x.firstChild);
        }
        for (var i = 0; i < jsonIcberg.Pictures.length; i++) {
            var node = document.createElement("LI");
            var imgNode = document.createElement("IMG");
            imgNode.src = "../DataReceived/" + yearSelected + "/" +icebergSelected + "/" +jsonIcberg.Pictures[i] ;
            imgNode.height = 250;
            imgNode.width =250;
            node.appendChild(imgNode);
            x.appendChild(node);  
        }
        displayDimensions(jsonIcberg);
        displayWind(jsonIcberg);
        document.getElementById("ADCP_Img").src = "../DataReceived/" + yearSelected + "/" +icebergSelected + "/" +jsonIcberg.ADCP.Img;
        document.getElementById("CTD_Img").src = "../DataReceived/" + yearSelected + "/" +icebergSelected + "/" +jsonIcberg.CTD.Img;
        
        clearPCD();
        selectModel();
        if(mapInitialized){
            try {
                setMapData();
            }catch(err){
                alert("An error occured while loading the map\nCheck your internet connection\n (Error msg: " +err.message+")");
            }
        }
    }
}      

function displayDimensions(jsonDataReceived){

    document.getElementById("icebergHeight").innerHTML = jsonDataReceived.Dimensions.Height;
    document.getElementById("icebergWidth").innerHTML = jsonDataReceived.Dimensions.Width;
    document.getElementById("icebergVolume").innerHTML = jsonDataReceived.Dimensions.VolumeTotal;
}


function displayWind(jsonDataReceived){

    document.getElementById("minSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Min;
    document.getElementById("aveSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Average;
    document.getElementById("maxSpeedWind").innerHTML = jsonDataReceived.Winds.True.Speed.Max;

    document.getElementById("minDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Min;
    document.getElementById("aveDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Average;
    document.getElementById("maxDirWind").innerHTML = jsonDataReceived.Winds.True.Heading.Max;
}

function selectModel() {
    IcebergModelName =document.getElementById("selectModel").value;
   filepathIcebergModel  ="../DataReceived/" + yearSelected + "/" +icebergSelected + "/" +IcebergModelName;
   init();
   animate();

}
//Google map

function initMap(plat,plong) {
        mapInitialized=true;
        var uluru = {lat: jsonIcberg.Location.Latitude, lng: jsonIcberg.Location.Longitude};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }


//PCD functions 
function init() {
    var parentToPCDViewer = document.getElementById("PCDviewer");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 1000 );
     camera.position.x = 0.1;
    camera.position.z = 10;
   camera.up.set(0,0,1);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0x002159 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(700,500 );
    parentToPCDViewer.appendChild( renderer.domElement );

    controls = new THREE.TrackballControls( camera ,renderer.domElement);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 2.5;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    //controls.minDistance = 0.3;
    //controls.maxDistance = 0.3 * 100;
    scene.add( camera );
    var axisHelper = new THREE.AxisHelper( 0.1 );
    scene.add( axisHelper );
    
    var loader = new THREE.PCDLoader();
    loader.load( filepathIcebergModel, function ( mesh ) {
        scene.add( mesh );
        mesh.material.size=0.3;
        mesh.material.color.setHex(0xFFFFFF);
        var center = mesh.geometry.boundingSphere.center;
        controls.target.set( center.x, center.y, center.z);
        controls.update();
    } );
    container = document.createElement( 'div' );
    parentToPCDViewer.appendChild( container );
    container.appendChild( renderer.domElement );
    //parentToPCDViewer.appendChild( renderer.domElement );//VSO
    //stats = new Stats();
    //container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('keydown', keyboard);
}
function onWindowResize() {
    camera.aspect = document.getElementById("PCDviewer").innerWidth / document.getElementById("PCDviewer").innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( document.getElementById("PCDviewer").innerWidth, document.getElementById("PCDviewer").innerHeight );
    controls.handleResize();
}
function keyboard ( ev ) {
    var ZaghettoMesh = scene.getObjectByName( IcebergModelName );
    switch ( ev.key ) {
        case '+':
            ZaghettoMesh.material.size*=1.2;
            ZaghettoMesh.material.needsUpdate = true;
            break;
        case '-':
            ZaghettoMesh.material.size/=1.2;
            ZaghettoMesh.material.needsUpdate = true;
            break;
        case 'c':
            ZaghettoMesh.material.color.setHex(Math.random()*0xffffff);
            ZaghettoMesh.material.needsUpdate = true;
            break;
        case 'b':
            renderer.setClearColor(Math.random()*0xffffff);
            break;
        case'i':
                clearPCD();
                init();  
            break;
        case's':     
            init();
            break;
    }
}

function clearPCD(){
    while (document.getElementById("PCDviewer").firstChild) {
          document.getElementById("PCDviewer").removeChild(document.getElementById("PCDviewer").firstChild);
    }       
    
}
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    //stats.update();
}


// Google Maps functions
function setMapData() {
    
    //calculate average lat long
    var centerLat = 0;
    var centerLng = 0;

    for (var i = 0; i < jsonIcberg.vehiclePath.length; i++) {
        centerLat+=jsonIcberg.vehiclePath[i].lat;
        centerLng+=jsonIcberg.vehiclePath[i].lng;
        }
    centerLat/=jsonIcberg.vehiclePath.length;
    centerLng/=jsonIcberg.vehiclePath.length;

    
    //Init Map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: centerLat, lng: centerLng},
    mapTypeId: google.maps.MapTypeId.TERRAIN //HYBRID
  });
    
    //Set SeaDragon Path
  var seaDragonPath = new google.maps.Polyline({
    path: jsonIcberg.vehiclePath ,
    geodesic: true,
    strokeColor: '#ede900',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  seaDragonPath.setMap(map);

    // Set Iceberg Perimeter
  var IcebergPerimeter = new google.maps.Polygon({
    paths: jsonIcberg.IcebergPerimeter,
    strokeColor: '#040060',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3634d1',
    fillOpacity: 0.35
  });
  IcebergPerimeter.setMap(map);   
    
    //Iceberg Drift Path
    if(jsonIcberg.IcebergDrift.length>0){
      var IcebergDriftPath = new google.maps.Polyline({
        path: jsonIcberg.IcebergDrift,
        geodesic: true,
        strokeColor: '#ff9900',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      IcebergDriftPath.setMap(map);         
    }
    
    
}

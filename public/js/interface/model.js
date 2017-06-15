//iceberg model

function updateMesh(xarr,yarr,zarr){
console.log('updateMesh() starting');
var data=[
  {
    alphahull:5,
    opacity:1,
    color:'rgb(230, 255, 255)',
    type: 'mesh3d',
    x: xarr,
    y: yarr,
    z: zarr
  }
];
// Plotting the mesh
Plotly.newPlot('iceberg_plot', data);
console.log('updateMesh() ending');
}

function updateDim(h,w,v){
  console.log("updateDim() running");
  console.log("h: "+h+"w: "+w+"v: "+v);
  var hTd = document.getElementById("icebergHeight");
  var wTd = document.getElementById("icebergWidth");
  var vTd = document.getElementById("icebergVolume");
  hTd.innerHTML=h;
  wTd.innerHTML=w;
  vTd.innerHTML=v;
  console.log("updateDim() done");
}

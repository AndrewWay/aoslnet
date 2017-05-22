$.ajax({
    url: "public/data/testberg.txt",
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
        },
    dataType: "text",
    complete: function () {
        // call a function on complete 
        console.log('Function completed.');
        for(i=0;i<data.length;i++){
            console.log(data[i]);
        }
    }
});

console.log('Generating random data');
// Generating random data..
a=[]; b=[]; c=[];
for(i=0;i<50;i++)
  {
  var a_ = Math.random(); 
   a.push(a_);
  
  var b_ = Math.random(); 
   b.push(b_);
  
  var c_ = Math.random(); 
   c.push(c_);
  }
// Plotting the mesh
var data=[
  {
    alphahull:5,
    opacity:0.8,
    color:'rgb(200,100,300)',
    type: 'mesh3d',
    x: a,
    y: b,
    z: c,
  }
];
Plotly.newPlot('iceberg_plot', data);


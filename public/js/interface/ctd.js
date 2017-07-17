//Parameters
//TODO Rename this file to include functions for handling data regarding water
time_range=10;//TODO: Allow user to set this value in the interface
vMargin=0.1;//10%
graph_container_id='display';
graph_dopts=new Map();
graph_dtabs=new Map();
graph_charts=new Map();
graph_ids=new Array(0);//Array to keep track of all the graph div ids
id_counter=0;
dataSources=[];
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});


// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(loadCharts);

function loadCharts(){
  for(i=0;i<dataSources.length;i++){
    addChart(dataSources.get(i));
  }
}

function addChart(dataname) {
    var colorhex='#'+Math.floor(Math.random()*16777215).toString(16);
    
    time_min=0;
    time_max=time_min+time_range;
    var dtab = new google.visualization.DataTable();
    var label = jsUcfirst(dataname);
    //add data columns in chart data tables
    dtab.addColumn('number','t');
    dtab.addColumn('number',label);

    // Set chart options
    var dopts = {
        title: label,
        curveType: 'function',
        legend: { position: 'bottom' },
      
        vAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 1,
                min: 0,
            },
            gridlines: {
                count: 10,
            }
      },
    hAxis: {
      viewWindowMode: 'explicit',
      viewWindow: {
        max: time_max,
        min: time_min,
      },
      gridlines: {
        ticks: 5,
      }
    },
    series: {
      0: {color: colorhex},
    }
  };
  
  var chart_div=document.createElement('div');
  var chart_id='graph_'+id_counter;
  chart_div.id=chart_id;
  chart_div.className='graph';
  document.getElementById('graphs').appendChild(chart_div);

  console.log('Appending new chart to '+chart_div.id);
  var chart = new google.visualization.LineChart(document.getElementById(chart_id));  
  graph_dtabs.set(id_counter,dtab);
  graph_dopts.set(id_counter,dopts);
  graph_charts.set(id_counter,chart);
  graph_ids.push(id_counter);

  chart.draw(dtab, dopts);
  id_counter=id_counter+1;
}

function redimension(id){
  var datatable=graph_dtabs.get(id);
  var dataoption=graph_dopts.get(id);
  var colmax=(1+vMargin)*datatable.getColumnRange(1).max;
  var colmin=(1-vMargin)*datatable.getColumnRange(1).min;
  dataoption.vAxis.viewWindow.max=colmax;
  dataoption.vAxis.viewWindow.min=colmin;
}

function setplotData(id,datarray){
  var datatable=graph_dtabs.get(id);
  for(i=0;i<datatable.getNumberOfRows();i++){
    datatable.removeRow(0);
  }
  for(i=0;i<datarray.length;i++){
    datatable.addRow([i,datarray[i]]);
  }
  redimension(id);
}

function redraw(time){
    time_max = time;
    time_min = time_max-time_range;
    for(i=0;i<graph_ids.length;i++){
      var id=graph_ids[i];
      var dopt=graph_dopts.get(i);
      var dtab=graph_dtabs.get(i);
      var chart=graph_charts.get(i);
      dopt.hAxis.viewWindow.max = time_max;
      dopt.hAxis.viewWindow.min = time_min;    
      chart.draw(dtab,dopt);
    }
}

function removeChart(id){
  
}

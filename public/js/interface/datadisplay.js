/**
 * @file Charts and Displays
 */

//Parameters
//TODO Rename this file to include functions for handling data regarding water
time_range = 10; //TODO: Allow user to set this value in the interface
vMargin = 0.1; //10%
graph_container_id = 'display';
graph_dopts = new Map();
graph_dtabs = new Map();
graph_charts = new Map();
graph_ids = new Array(0); //Array to keep track of all the graph div ids
id_counter = 0;
display_ids = new Array(0);
// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});


// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(loadCharts);

function loadCharts() {
/*for(i=0;i<dataSources.length;i++){
    addChart(dataSources.get(i));
  }*/
}


function addDisplay(dataname) {
  var datatable = document.getElementById('displaytable');
  var tr = document.createElement('tr');
  var newrowid = 'datadisplay_' + dataname;
  tr.id = newrowid;

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var dataid = 'displayvalue_' + dataname;
  td2.id = dataid;

  var text1 = document.createTextNode(dataname);
  var text2 = document.createTextNode('-');

  td1.appendChild(text1);
  td2.appendChild(text2);
  tr.appendChild(td1);
  tr.appendChild(td2);

  datatable.appendChild(tr);
  display_ids.push(newrowid);
}

function addChart(dataname) {
  var colorhex = '#' + Math.floor(Math.random() * 16777215).toString(16);

  time_min = 0;
  time_max = time_min + time_range;
  var dtab = new google.visualization.DataTable();
  var label = UpperCaseFirst(dataname);
  //add data columns in chart data tables
  dtab.addColumn('number', 't');
  dtab.addColumn('number', label);

  // Set chart options
  var dopts = {
    title: label,
    curveType: 'function',
    legend: {
      position: 'bottom'
    },

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
      0: {
        color: colorhex
      },
    }
  };

  var chart_div = document.createElement('div');
  var chart_id = 'graph_' + dataname;
  chart_div.id = chart_id;
  chart_div.className = 'graph';
  document.getElementById('graphs').appendChild(chart_div);

  console.log('Appending new chart to ' + chart_div.id);
  var chart = new google.visualization.LineChart(document.getElementById(chart_id));
  graph_dtabs.set(chart_id, dtab);
  graph_dopts.set(chart_id, dopts);
  graph_charts.set(chart_id, chart);
  graph_ids.push(chart_id);

  chart.draw(dtab, dopts);
  id_counter = id_counter + 1;
}

function redimension(id) {
  var datatable = graph_dtabs.get(id);
  var dataoption = graph_dopts.get(id);
  var colmax = (1 + vMargin) * datatable.getColumnRange(1).max;
  var colmin = (1 - vMargin) * datatable.getColumnRange(1).min;
  dataoption.vAxis.viewWindow.max = colmax;
  dataoption.vAxis.viewWindow.min = colmin;
}

function setplotData(id, datarray) {
  var datatable = graph_dtabs.get(id);
  for (i = 0; i < datatable.getNumberOfRows(); i++) {
    datatable.removeRow(0);
  }
  for (i = 0; i < datarray.length; i++) {
    datatable.addRow([i, datarray[i]]);
  }
  redimension(id);
}

function redraw(time) {
  time_max = time;
  time_min = time_max - time_range;
  for (i = 0; i < graph_ids.length; i++) {
    var id = graph_ids[i];
    var dopt = graph_dopts.get(id);
    var dtab = graph_dtabs.get(id);
    var chart = graph_charts.get(id);
    dopt.hAxis.viewWindow.max = time_max;
    dopt.hAxis.viewWindow.min = time_min;
    chart.draw(dtab, dopt);
  }
}

function redisplay(time) {
  for (var i = 0; i < display_ids.length; i++) {
    var arraylabel = display_ids[i].replace('datadisplay_', '');
    var dataid = 'displayvalue_' + arraylabel;
    var datum = getDatum(arraylabel, time);
    var element = document.getElementById(dataid);
    element.innerHTML = datum;
  }
}

function removeChart(id) {

}

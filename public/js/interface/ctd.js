//Parameters
time_range=10;//TODO: Allow user to set this value in the interface
vMargin=0.1;//10%
// Load the Visualization API and the corechart package.

google.charts.load('current', {'packages':['corechart']});


// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(setupChart);

function setupChart() {
    time_min=0;
    time_max=time_min+time_range;
    sal_data = new google.visualization.DataTable();
    temp_data = new google.visualization.DataTable();
    depth_data = new google.visualization.DataTable();

    //add data columns in chart data tables
    sal_data.addColumn('number','t');
    sal_data.addColumn('number','S');
    temp_data.addColumn('number','t');
    temp_data.addColumn('number','T');
    depth_data.addColumn('number','t');
    depth_data.addColumn('number','D');
    // Set chart options
    sal_options = {
        title: 'Salinity',
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
            0: {color: '#50ed7a'},
        }
    };
    temp_options = {
        title: 'Temperature',
        curveType: 'function',
        legend: { position: 'bottom' },
      
        vAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 20,
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
            0: {color: '#f44242'},
        }
    };
    depth_options = {
        title: 'Depth',
        curveType: 'function',
        legend: { position: 'bottom' },
      
        vAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                max: 10,
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
            0: {color: '#479fed'},
        }
    };

   
    // Instantiate and draw our chart, passing in some options.
    chart1 = new google.visualization.LineChart(document.getElementById('curve_chart1'));
    chart2 = new google.visualization.LineChart(document.getElementById('curve_chart2'));
    chart3 = new google.visualization.LineChart(document.getElementById('curve_chart3'));

   chart1.draw(sal_data, sal_options);
   chart2.draw(temp_data, temp_options);
   chart3.draw(depth_data, depth_options);
}

function setplotData(S,T,D,t){
  for(i=0;i<sal_data.getNumberOfRows();i++){
    sal_data.removeRow(0);
  }
  for(i=0;i<temp_data.getNumberOfRows();i++){
    temp_data.removeRow(0);
  }
  for(i=0;i<depth_data.getNumberOfRows();i++){
    depth_data.removeRow(0);
  }

  for(i=0;i<S.length;i++){
    sal_data.addRow([i,S[i]]);
  }
  for(i=0;i<T.length;i++){
    temp_data.addRow([i,T[i]]);
  }
  for(i=0;i<D.length;i++){
    depth_data.addRow([i,D[i]]);
  }
}

function redraw(time){
  
    time_max = time;
    time_min = time_max-time_range;
    sal_options.hAxis.viewWindow.max = time_max;
    sal_options.hAxis.viewWindow.min = time_min;
    temp_options.hAxis.viewWindow.max = time_max;
    temp_options.hAxis.viewWindow.min = time_min;
    depth_options.hAxis.viewWindow.max = time_max;
    depth_options.hAxis.viewWindow.min = time_min;
    
    //TODO: Set the vAxis size based on the currently viewed data
    sal_options.vAxis.viewWindow.max=(1+vMargin)*sal_data.getColumnRange(1).max;
    sal_options.vAxis.viewWindow.min=(1-vMargin)*sal_data.getColumnRange(1).min;

    temp_options.vAxis.viewWindow.max=(1+vMargin)*temp_data.getColumnRange(1).max;
    temp_options.vAxis.viewWindow.min=(1-vMargin)*temp_data.getColumnRange(1).min;

    depth_options.vAxis.viewWindow.max=(1+vMargin)*depth_data.getColumnRange(1).max;
    depth_options.vAxis.viewWindow.min=(1-vMargin)*depth_data.getColumnRange(1).min;

    chart1.draw(sal_data,sal_options);
    chart2.draw(temp_data,temp_options);
    chart3.draw(depth_data,depth_options);
}

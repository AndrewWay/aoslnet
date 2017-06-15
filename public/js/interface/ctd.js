//Parameters
time_range=100;
table_limit=time_range;//Change this (must be guaranteed to be integer)
vMargin=0.1;//10%
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});


// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(setupChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function setupChart() {
  time_min=0;
time_max=100;
    //initialize chart data
    cond_data = new google.visualization.DataTable();
    temp_data = new google.visualization.DataTable();
    depth_data = new google.visualization.DataTable();
    //add data columns in chart data tables
    cond_data.addColumn('number','t');
    cond_data.addColumn('number','C');
    temp_data.addColumn('number','t');
    temp_data.addColumn('number','T');
    depth_data.addColumn('number','t');
    depth_data.addColumn('number','D');
    // Set chart options
    cond_options = {
        title: 'Conductivity',
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

   chart1.draw(cond_data, cond_options);
   chart2.draw(temp_data, temp_options);
   chart3.draw(depth_data, depth_options);
}

function redraw(C,T,D,time){
    new_cond=[time,C];
    new_temp=[time,T];
    new_depth=[time,D];

 
    if ( cond_data.getNumberOfRows() > table_limit ){
        //This condition assumes all tables are of equal length
        cond_data.removeRow(0);
        temp_data.removeRow(0);
        depth_data.removeRow(0);    
    }
    if ( time >= time_max ){
        time_max = time;
        time_min = time_max-time_range;
        cond_options.hAxis.viewWindow.max = time_max;
        cond_options.hAxis.viewWindow.min = time_min;
        temp_options.hAxis.viewWindow.max = time_max;
        temp_options.hAxis.viewWindow.min = time_min;
        depth_options.hAxis.viewWindow.max = time_max;
        depth_options.hAxis.viewWindow.min = time_min;
    }
    
    cond_options.vAxis.viewWindow.max=(1+vMargin)*cond_data.getColumnRange(1).max;
    cond_options.vAxis.viewWindow.min=(1-vMargin)*cond_data.getColumnRange(1).min;

    temp_options.vAxis.viewWindow.max=(1+vMargin)*temp_data.getColumnRange(1).max;
    temp_options.vAxis.viewWindow.min=(1-vMargin)*temp_data.getColumnRange(1).min;

    depth_options.vAxis.viewWindow.max=(1+vMargin)*depth_data.getColumnRange(1).max;
    depth_options.vAxis.viewWindow.min=(1-vMargin)*depth_data.getColumnRange(1).min;
   
    cond_data.addRow(new_cond);
    temp_data.addRow(new_temp);
    depth_data.addRow(new_depth);

    chart1.draw(cond_data,cond_options);
    chart2.draw(temp_data,temp_options);
    chart3.draw(depth_data,depth_options);
}

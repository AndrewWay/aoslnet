//Parameters
time_max=20;
time_min=0;
t=0;
time_increment=1;
table_limit=time_max

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});


// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(setupChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function setupChart() {
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

function redraw(c,t,d){
  
}
setInterval(function(){
//To update charts with actual data, replace the following with... recieved data from AJAX function?  
    new_cond=[t,0.5+Math.random()*0.1];
    new_temp=[t,10+Math.random()*2];
    new_depth=[t,6+Math.random()*2];

    if ( cond_data.getNumberOfRows() >= table_limit ){
        //This condition assumes all tables are of equal length
        cond_data.removeRow(0);
        temp_data.removeRow(0);
        depth_data.removeRow(0);    
    }
    if ( t > time_max ){
        time_max = time_max + time_increment;
        time_min = time_min + time_increment;
        cond_options.hAxis.viewWindow.max = time_max;
        cond_options.hAxis.viewWindow.min = time_min;
        temp_options.hAxis.viewWindow.max = time_max;
        temp_options.hAxis.viewWindow.min = time_min;
        depth_options.hAxis.viewWindow.max = time_max;
        depth_options.hAxis.viewWindow.min = time_min;
    }


    cond_data.addRow(new_cond);
    temp_data.addRow(new_temp);
    depth_data.addRow(new_depth);
    
    chart1.draw(cond_data,cond_options);
    chart2.draw(temp_data,temp_options);
    chart3.draw(depth_data,depth_options);

    t=t+time_increment;

},1000*time_increment);

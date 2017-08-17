/**
 * @file Data Chart
 */

// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

/**
 * @constructor
 */
var DataChart = function(dataLabel,parentID){
  var hexcolor = '#' + Math.floor(Math.random() * 16777215).toString(16); // Assign a random color to the chart line
  this.vMargin =0.1;
  this.chartID = '';
  this.parentDivID = parentID;
  this.xMin = 0;
  this.xRange = 30; // Default graph x range
  this.xMax = this.xMin + this.xRange;
  var chartLabel = beautifyLabel(dataLabel); // Uppercase the first letter of the dataset label
  this.dataTable = new google.visualization.DataTable(); // Contains chart xy data
  this.dataTable.addColumn('number', 't');
  this.dataTable.addColumn('number', chartLabel);
  var chartDiv = document.createElement('div');
  this.chartID = 'graph_' + dataLabel;
  chartDiv.id = this.chartID;
  chartDiv.className = 'graph';
  document.getElementById(this.parentDivID).appendChild(chartDiv); 
  this.chart = new google.visualization.LineChart(document.getElementById(this.chartID));
 
  // Set chart options
  this.chartOptions = {
    title: chartLabel,
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
        max: this.xMax,
        min: this.xMin,
      },
      gridlines: {
        ticks: 5,
      }
    },
    series: {
      0: {
        color: hexcolor
      },
    }
  };
  
  /**
   * Redraw the chart
   */
  this.refresh = function(){
    this.chart.draw(this.dataTable, this.chartOptions);
  }
  
  this.refresh();
  /**
   * Update the charts, plots, and google map with data associated with time index t
   * @param {number} t Time index 
   */
  this.dispdata = function (t) {
      this.shiftChart(t);  
      this.refresh();
    }
  };
  
  /**
   * Returns the HTML ID of the charts div
   */
  this.getID = function(){
    return this.chartID;
  }
  
  /**
  * Automatically resize the y and x axes of a chart based on
  * max and minimum values of the chart's dataset
  * @param {string} chartID The ID of the chart to be resized
  */
  this.autoResizeAxes = function(chartID) {
    var copts = this.chartOptions;
    var dtab = this.dataTable;
    var colmax = (1 + this.vMargin) * dtab.getColumnRange(1).max;
    var colmin = (1 - this.vMargin) * dtab.getColumnRange(1).min;
    copts.vAxis.viewWindow.max = colmax;
    copts.vAxis.viewWindow.min = colmin;
  }

  /**
   * Set the data table data
   * @param {array} datarray Array that contains data set  
   */
  this.setChartData = function(datarray) {
    for (var i = 0; i < this.dataTable.getNumberOfRows(); i++) {
      this.dataTable.removeRow(0);
    }
    for (var i = 0; i < datarray.length; i++) {
      if(typeof datarray[i] === 'number'){
        this.dataTable.addRow([i, datarray[i]]);
      } else if(typeof datarray[i] === 'string') {
        console.warn('Attempted to add String to chart data');
        this.dataTable.addRow([i, -1]);
      } else {
        console.warn('Attempted to add Object to chart data');
        this.dataTable.addRow([i, -1]);
      }
    }
  }

  /**
   * Shift chart to end at a specified time
   * @param {number} time 
   */
  this.shiftChart = function(time) {
    this.xMax = time;
    this.xMin = this.xMax - this.xRange;
    var copts = this.chartOptions;
    var dtab = this.dataTable;
    copts.hAxis.viewWindow.max = this.xMax;
    copts.hAxis.viewWindow.min = this.xMin;
    this.refresh();
  }

  /**
   * Delete the chart
   */
  this.delete = function() {
    chartDiv.remove();
  }
}

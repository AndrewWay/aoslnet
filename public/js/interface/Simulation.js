/** @constructor */
var Simulation = function (tmax) {

  var time_index = 0;
  var delay_factor = 1;
  this.timebarid = 'timebar';
  this.timeMax = 0;
    /**
   * Update the maximum value the time bar can have
   */
  this.updateTimeMax = function (t) {
    this.timeMax = t;
    document.getElementById(this.timebarid).max = this.timeMax;
  };
  this.updateTimeMax(tmax - 1);
  this.playid;
  this.playbtnid = 'playbtn';
  this.pausebtnid = 'pausebtn';
  this.stopbtnid = 'stopbtn';
  this.sdx = [];
  this.sdy = [];
  this.charts = new Array(0);
  this.monitors = new Array(0);
  this.managedEntities = new Array(0);
  /* PUBLIC FUNCTIONS */
  
  this.playEntities = function(index){
    for(var i = 0; i < this.managedEntities.length; i++){
      this.managedEntities[i].play(index);
    }
  }
  this.manage = function(newEntity){
    this.managedEntities.push(newEntity);
  }
  /**
   * Set simulation object to manage chart
   * @param {object} newChart The new chart to be tracked
   */
  this.manageChart = function(newChart){
    this.charts.push(newChart);
  }
  this.manageMonitor = function(newMonitor){
    this.monitors.push(newMonitor);
  }
  /**
   * Set the time index based on the current value of the slider bar
   */
  this.manualsetTime = function () {
    //TODO Have play and manualsetTime call the same single function for updating all data/positions/etc
    var newTime = document.getElementById(this.timebarid).value;
    console.log("Manually setting time to: " + newTime);
    this.set_time(newTime);
    this.dispdata(this.get_time());
    this.playEntities(newTime);
  };

  /**
   * Iterate through trial data and update displays
   */
  this.play = function () {
    document.getElementById(this.pausebtnid).disabled = false;
    document.getElementById(this.stopbtnid).disabled = false;
    document.getElementById(this.playbtnid).disabled = true;
    document.getElementById(this.timebarid).disabled = false;
    var parent = this;
    this.playid = setInterval(function () {
      var ti = parent.get_time(); //time[time_index];//Json objects have bad timestamp data
      //        console.log('time: '+ti+' sdx: '+parent.sdx[ti]+' sdy: '+parent.sdy[ti]);        
      parent.dispdata(ti);
      parent.setTimeBar(ti);
      parent.playEntities(ti);
      //        setSDModelPosition(parent.sdx[ti],parent.sdy[ti],SDBottom);        
      parent.set_time(ti + 1);
      if (ti >= parent.timeMax) {
        clearInterval(parent.playid);
      }
    }, 1000 * parent.delay_factor);
  };

  /**
   * Convert SeaDragon latitude and longitude to point cloud local frame
   * @param {Array} x Latitude positions of SeaDragon
   * @param {Array} y Longitude positions of SeaDragon
   * @param {Array} gps_origin Origin in the world frame in GPS coordinates
   */
  this.setSD = function (x, y, gps_origin) {
    var xorigin = gps_origin[0];
    var yorigin = gps_origin[1];
    console.log(yorigin);
    var xorigin_m = lat2m(xorigin);
    var yorigin_m = long2m(yorigin);
    console.log(yorigin_m);
    console.log('Converting gps to local');
    console.log(x);
    console.log(y);
    // Convert xy coordinates to metres and relative to local frame
    for (i = 0; i < x.length; i++) {
      x[i] = lat2m(x[i]) - xorigin_m;
      y[i] = long2m(y[i]) - yorigin_m;
    }
    sdx = x;
    sdy = y;
  };

  /**
   * Pause playback 
   */
  this.pause = function () {
    clearInterval(this.playid);
    document.getElementById(this.timebarid).disabled = false;
    document.getElementById(this.pausebtnid).disabled = true;
    document.getElementById(this.playbtnid).disabled = false;
  };

  /**
   * Stop playback and reset time to 0
   */
  this.stop = function () {
    clearInterval(this.playid);
    this.set_time(0);
    this.setTimeBar(this.get_time());
    this.dispdata(this.get_time());
    document.getElementById(this.timebarid).disabled = false;
    document.getElementById(this.stopbtnid).disabled = true;
    document.getElementById(this.pausebtnid).disabled = true;
    document.getElementById(this.playbtnid).disabled = false;
  };

  /**
   * Get the current value of time_index
   * @returns {number}
   */
  this.get_time = function () {
    return parseInt(time_index);
  };

  /**
   * Update the charts, plots, and google map with data associated with time index t
   * @param {number} t Time index 
   */
  this.dispdata = function (t) {
    for(i = 0; i < this.charts.length; i++){
      this.charts[i].shiftChart(t);  
      this.charts[i].refresh();
    }
    for(i = 0; i < this.monitors.length; i++){
      this.monitors[i].update(t);  
    }
    // updateSDPosition(t)
  };

  /**
   * Set the timebar position to t
   */
  this.setTimeBar = function (t) {
    document.getElementById(this.timebarid).value = t;
  };

  /**
   * Set the time index
   * @param {number} new time index 
   */
  this.set_time = function (t) {
    time_index = t;
  };


  /* PRIVATE FUNCTIONS */

  /**
   * Convert latitude degrees to metres
   * @param {number} latitude degrees
   * @returns {number} Latitude degrees in metres
   */
  var lat2m = function (phi) {
    return 111132.92 - 559.82 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi) - 0.0023 * Math.cos(6 * phi);
  };

  /**
   * Convert longitude degrees to metres
   * @param {number} longitude degrees
   * @returns {number} Longitude degrees in metres
   */
  var long2m = function (theta) {
    return 111412.84 * Math.cos(theta) - 93.5 * Math.cos(3 * theta) + 0.118 * Math.cos(5 * theta);
  };

  /**
   * Update the clock with the time associated with time index t
   * @param {number} t time index
   */
  var setclock = function (t) {
    var date = new Date(time[t] * 1000);
    var hours = date.getHours(); // Hours part from the timestamp
    var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
    var seconds = "0" + date.getSeconds(); // Seconds part from the timestamp
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    document.getElementById(clockid).innerHTML = formattedTime;
  };
};

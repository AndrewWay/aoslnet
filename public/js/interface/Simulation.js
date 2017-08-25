/**
 * @constructor
 * @param {Number} tmax Maximum time index of the simulation
 */
 
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
  
  /* INITIALIZATION */
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
  
  /**
   * Play all entities being tracked by this simulation
   */  
  this.playEntities = function(index){
    for(var i = 0; i < this.managedEntities.length; i++){
      this.managedEntities[i].play(index);
    }
  }
  
  /**
   * Track a new entity (monitor, chart, etc.)
   */
  this.manage = function(newEntity){
    this.managedEntities.push(newEntity);
  }

  /**
   * Set the time index based on the current value of the slider bar
   */
  this.manualsetTime = function () {
    var newTime = document.getElementById(this.timebarid).value;
    this.set_time(newTime);
    this.playEntities(newTime);
  };

  /**
   * Replay simulation by incrementing time index and calling play for each tracked entity
   */
  this.play = function () {
    document.getElementById(this.pausebtnid).disabled = false;
    document.getElementById(this.stopbtnid).disabled = false;
    document.getElementById(this.playbtnid).disabled = true;
    document.getElementById(this.timebarid).disabled = false;
    var parent = this;
    this.playid = setInterval(function () {
      var ti = parent.get_time();
      parent.setTimeBar(ti);
      parent.playEntities(ti);   
      parent.set_time(ti + 1);
      if (ti >= parent.timeMax) {
        clearInterval(parent.playid);
      }
    }, 1000 * parent.delay_factor);
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
    this.playEntities(this.get_time());
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
  
  this.delete = function(){
    this.updateTimeMax(0);
    this.sdx = [];
    this.sdy = [];
    this.charts = new Array(0);
    this.monitors = new Array(0);
    this.managedEntities = new Array(0);
  }
};

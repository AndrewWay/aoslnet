/**
 * @file Data Monitor
 */
var DataMonitor = function(dataName, parentID){

  this.dataSet = [];
  this.rowID = 'monitor_' + dataName;
  this.parentTable = document.getElementById(parentID);
  var tr = document.createElement('tr');
  tr.id = this.rowID;

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  this.dataID = 'monitorValue_' + dataName;
  td2.id = this.dataID;

  var text1 = document.createTextNode(dataName);
  var text2 = document.createTextNode('-');

  td1.appendChild(text1);
  td2.appendChild(text2);
  tr.appendChild(td1);
  tr.appendChild(td2);

  this.parentTable.appendChild(tr);

  /**
   * Update the monitor with value corresponding to a given time
   * @param {number} time Time index of the new value
   */
  this.update = function(time) {
    var newMonitorValue = this.dataSet[time];
    var element = document.getElementById(this.dataID);
    element.innerHTML = newMonitorValue;
  }

  /**
   * Set the data set
   * @param {array} data The new data set
   */
  this.setData = function(data){
    this.dataSet = data;
  }
}





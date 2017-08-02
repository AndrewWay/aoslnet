/*
 * @file Data Presentation
 */

/*
 * Add toggle for displaying 3D Objects
 */

function addToggle(id, callback, name) {
  var element = document.createElement("input");
  element.type = "button";
  element.name = name;
  element.value = name;
  element.onclick = callback;
  element.setAttribute('onclick', callback);
  var toggleContainer = document.getElementById('pics');
  toggleContainer.append(element);
}

/*
 * Create the numerical displays and graphs
 */

function createAllDisplays() {
  for (var i = 0; i < dsstrings.length; i++) {
    var label = dsstrings[i];
    if ($("#graphs > div").length < autographlimit) {
      //create a graph
      createDisplay('graph', label);
    }
    else {
      //Create a monitor
      createDisplay('monitor', label);
    }
  }
}

/*
 * Add a new display
 * param {String} type
 * param {String} label
 */

function createDisplay(type, label) {
  if (type === 'graph') {
    addChart(label);
  }
  else if (type === 'monitor') {
    addDisplay(label);
  }
}

function UpperCaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

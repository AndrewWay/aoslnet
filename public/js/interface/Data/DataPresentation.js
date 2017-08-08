/**
 * @file Data Presentation
 */

/**
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

/**
 * Capitalize the first letter of a string
 * @param {string} string The string to be beautified
 */
function beautifyLabel(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

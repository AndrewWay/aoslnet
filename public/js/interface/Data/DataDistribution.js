/**
 * @file Data distribution
 */
jsonKeyPaths = new Array(0); // Contains all the key paths of a JSON object
jsonDataMap = new Map(); // Maps a JSON key path to a data array

/**
 * Recursively extract all keys from the received JSON file
 * @param {object} json
 */
function extractKeyPaths(json) {
  var keys = Object.keys(json);
  for (var i = 0; i < keys.length; i++) {
    var childkey = keys[i];
    var child = json[childkey];
    if (child !== null && typeof child === 'object') { // Check if the current object has a child
      keypathHelper(childkey, childkey, child);
    }
    else { // If not, then its a "tree leaf". Add to the array of data labels
      jsonKeyPaths.push(childkey);
    }
  }
}

/**
 * Recursive helper for extractKeyPaths
 * @param {String} keypath
 * @param {String} key
 * @param {object} json
 */
function keypathHelper(keypath, key, json) {
  var keys = Object.keys(json);
  for (var i = 0; i < keys.length; i++) {
    var childkey = keys[i];
    var child = json[childkey];
    var childkeypath = keypath + '&' + childkey;
    if (child !== null && typeof child === 'object') { // Check if the current object has a child
      keypathHelper(childkeypath, childkey, child);
    }
    else { // If not, then its a "tree leaf". Add to the array of data labels
      jsonKeyPaths.push(childkeypath);
    }
  }
}

/**
 * Take the data array and distribute it into seperate arrays that are referenced in a map
 * @param {Array} dat
 */
function distributeData(dat) {
  console.log('distributeData() start');
  var setSize = dat.length;
  for (i = 0; i < jsonKeyPaths.length; i++) {
    var tmparray = new Array(setSize);
    var keypath = jsonKeyPaths[i];
    for (j = 0; j < setSize; j++) {
      var datum = dat[j];
      tmparray[j] = keytoValue(keypath, datum);
    }
    jsonDataMap.set(keypath, tmparray); // Map each JSON key path to an array of its corresponding data
    // e.g. 'CTD&temperature' is a key that maps to an array containing all temperature data from the CTD
    // In the JSON array stored in the database, accessing each element of this same data would done as: var ctd_temp = json[i].CTD.temperature
    //This data mapping method is used so the JavaScript can work with any JSON of any structure.
    //In the future, if someone were to upload a JSON with a new, unanticipated data source, the JavaScript would still be able to extract it and display it
  }
  console.log('distributeData() finished');
}

/**
 * Take a JSON array and return the leaf value found at the end of keypath
 * @param {String} keypath
 */
function keytoValue(keypath, json) {
  var keyarray = keypath.split("&");
  for (var i = 0; i < keyarray.length; i++) {
    var key = keyarray[i];
    if (json.hasOwnProperty(key)) {
      json = json[key];
    }
  }
  return json;
}

/**
 * Returns the value in location index of array mapped to by arraylabel
 * @param {String} arraylabel
 * @param {Number} index
 * @return {Number} datum
 */
function getDatum(jsonKeyPath, index) {
  var arr = jsonDataMap.get(jsonKeyPath);
  var ret = arr[index];
  return ret;
}

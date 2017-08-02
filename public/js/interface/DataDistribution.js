/**
 * @file Data distribution
 */


/**
 * Recursively extract all keys from the received JSON file
 * @param {String} json
 */

function extractKeyPaths(json) {
  var keys = Object.keys(json);
  for (var i = 0; i < keys.length; i++) {
    var childkey = keys[i];
    var child = json[childkey];
    if (child !== null && typeof child === 'object') {
      keypathHelper(childkey, childkey, child);
    }
    else {
      dsstrings.push(childkey);
    }
  }
}

/**
 * Recursive helper for extractKeyPaths
 * @param {String} keypath
 * @param {String} key
 * @param {String} json
 */

function keypathHelper(keypath, key, json) {
  var keys = Object.keys(json);
  for (var i = 0; i < keys.length; i++) {
    var childkey = keys[i];
    var child = json[childkey];
    var childkeypath = keypath + '&' + childkey;
    if (child !== null && typeof child === 'object') {
      keypathHelper(childkeypath, childkey, child);
    }
    else {
      dsstrings.push(childkeypath);
    }
  }
}

/**
 * Take the data array and distribute it into seperate arrays that are referenced in a map
 * @param {Array} dat
 */

function distributeData(dat) {
  console.log('distributeData() start');
  setSize = dat.length;
  console.log("Measurement data set size: " + setSize);
  time = new Array(setSize);
  for (i = 0; i < dsstrings.length; i++) {
    var tmparray = new Array(setSize);
    var keypath = dsstrings[i];
    for (j = 0; j < setSize; j++) {
      var datum = dat[j];
      tmparray[j] = keytoValue(keypath, datum);
    }
    datamap.set(keypath, tmparray);
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

function getDatum(arraylabel, index) {
  var arr = datamap.get(arraylabel);
  var ret = arr[index];
  return ret;
}

/*
 * Get a JSON by specifying a URL to form a get request.
 * Get request will either request a page to be rendered, or some kind of JSON from the database
 */
function getJSON(url){
    console.log('getJSON() starting');
    console.log('requesting data from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
   // console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);
    console.log('getJSON() finished');
    return response;
}


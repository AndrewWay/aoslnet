function getJSON(url){
    console.log('getJSON() starting');
    console.log('requesting data from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);
    console.log('getJSON() finished');
    return response;
}

function getList(url){
    console.log('getJSON() starting');
    console.log('requesting data from:' + url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);
    console.log('getJSON() finished');
    return response;
}


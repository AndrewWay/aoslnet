//Browser-server data transfer

function download(){
    console.log("download() starting");
    var yearSelected = document.getElementById("selectYear").value;
    var bergSelected = document.getElementById("selectIceberg").value;
    var url='download/'+yearSelected+'/'+bergSelected+'/'+yearSelected+'_'+bergSelected+'.gz';
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log('database returned: '+request.responseText);
    console.log('download() finished');
}

function getList(url){
    console.log('requesting list from '+url);
    var request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send(null);
    console.log("hello?");
    console.log('database returned: '+request.responseText);
    var response = JSON.parse(request.responseText);

    console.log('Returning list');
    return response;
}

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


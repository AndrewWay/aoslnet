/**
 * @file Data Monitor
 */
 
 function addMonitor(dataName) {
  var datatable = document.getElementById('displaytable');
  var tr = document.createElement('tr');
  var newrowid = 'datadisplay_' + dataname;
  tr.id = newrowid;

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var dataid = 'displayvalue_' + dataname;
  td2.id = dataid;

  var text1 = document.createTextNode(dataname);
  var text2 = document.createTextNode('-');

  td1.appendChild(text1);
  td2.appendChild(text2);
  tr.appendChild(td1);
  tr.appendChild(td2);

  datatable.appendChild(tr);
  display_ids.push(newrowid);
}

function redisplay(time) {
  for (var i = 0; i < display_ids.length; i++) {
    var arraylabel = display_ids[i].replace('datadisplay_', '');
    var dataid = 'displayvalue_' + arraylabel;
    var datum = getDatum(arraylabel, time);
    var element = document.getElementById(dataid);
    element.innerHTML = datum;
  }
}

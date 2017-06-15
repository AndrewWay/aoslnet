//Pictures


function updatePic(p){
  console.log('updatePic()');
  console.log('pic: '+p);
  if(!(p === 'null')){
    document.getElementById("icedisp").src="../images/2017/Joey/"+p;
    $("#icedisp").on("error", function(){
        $(this).attr('src', 'images/notfound.png');
    });
  }
}

function updateGallery(){
  console.log('updateGallery() starting');
  var yearSelected = document.getElementById("selectYear").value;
  var bergSelected = document.getElementById("selectIceberg").value;
}

//Pictures


function updatePic(p){
  console.log('updatePic()');
  console.log('p: '+p);
  if(!(p === 'null')){
    document.getElementById("icedisp").src="images/2017/Joey/"+p;
    $("#icedisp").on("error", function(){
        $(this).attr('src', './public/images/notfound.png');
    });
  }
}

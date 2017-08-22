/**
 * @constructor
 * @author Andrew Way
 */
var Camera = function(parentID,names,base){
  var displayID = parentID;
  var pictureNames = names;
  var basePath = base;
  /**
   * Set the displayID to the ID of the HTML element that contains the picture display 
   * @param {String} newID The new ID of the HTML element containing the picture display
   */
  this.setDisplayID = function(newID){
    displayID = newID;
  }
  
  /**
   * Set the picture display's picture to the ith picture
   * @param {Number} i The index of the picture to be displayed
   */
  this.displayPicture = function(i){
    if(i < pictureNames.length){
      var picturePath = basePath + pictureNames[i];
      document.getElementById(displayID).src = picturePath;
    }
    else{
      console.log('Attempted access of picture names out of bounds');
    }
  }
  
  /**
   * Set the array of picture paths
   * @param {Array} newPicturePaths The array of picture paths
   */
  this.setPictureNames = function(newPictureNames){
    pictureNames = newPictureNames;
  }
  
  this.play = function(index){
    this.displayPicture(index);
  }
  /**
   * Delete the picture array and reset the camera
   */
   this.delete = function(index){
     pictureNames=[];
   }
   
   this.displayPicture(0);
}

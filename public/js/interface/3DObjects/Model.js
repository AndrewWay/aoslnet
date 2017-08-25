/**
 * @constructor
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 * @param {Object} Environment Demo object found in public/assets/js/demo.js. Creates the 3D environment
 */
var Model = function (Environment) {
  var rotWorldMatrix;
  this.World = Environment.ms_Scene;

  var toggleID = ''; // ID for html toggle
  this.toggled = 1; //Boolean for determining if model is visible
  this.appearance = {color: 0xffffff };
  this.mesh;
  var xposition = [];
  var yposition = [];
  var zposition = [];
  
  /**
   * Return position data corresponding to index
   * @param {Number} index The index of the position data
   * @return {Object} position Position object containing models position in local frame 
   */
  this.getPosition = function(index){
    var position = new Object();
    position.x = xposition[index];
    position.y = yposition[index];
    position.z = zposition[index];
    return position;
  }
  
  /**
   * Interfacing function with Simulation. Plays back the position of SeaDragon
   * @param {Number} index The index of the position data
   */
  this.play = function(index){
    var xcheck = index < xposition.length;
    var ycheck = index < yposition.length;
    var zcheck = index < zposition.length;
    if(xcheck && ycheck && zcheck){
      var newx = xposition[index];
      var newy = yposition[index];
      var newz = zposition[index];
      this.setPosition(newx,newy,newz);
    }
    else{
      console.log('Accessing model position array out of bounds');
    }
  }

  /**
   * Set the model position
   * @param {Object} positionData contains properties x, y, and z
   */
  this.setPositionData = function(positionData){
    xposition = positionData.x;
    yposition = positionData.y;
    zposition = positionData.z;
    console.log(xposition.length);
    console.log(yposition.length);
    console.log(zposition.length);
  }
  /**
   * set the hex color property of appearance
   * @param {string} hexColor Color in hex
   */
  this.setColor = function (hexColor) {
    this.appearance.color = hexColor;
  }

  /**
   * DEPRECATED. Update the mesh by specifying a new 3D model file path
   * @param {String} file
   */
  this.updateMesh = function () {
    console.log('updateMesh() starting');
    model();
    console.log('updateMesh() ending');
  };

  /**
   * DEPRECATED. Update the display for the iceberg dimensions
   * @param {Number} h Height
   * @param {Number} w Width
   * @param {Number} v Volume
   */
  this.updateDim = function (h, w, v) {
    var hTd = document.getElementById("icebergHeight");
    var wTd = document.getElementById("icebergWidth");
    var vTd = document.getElementById("icebergVolume");
    hTd.innerHTML = h;
    wTd.innerHTML = w;
    vTd.innerHTML = v;
    console.log("updateDim() done");
  }

  /**
   * Set the position of the model
   * @param {number} x x position
   * @param {number} y y position
   * @param {number} z z position
   */
  this.setPosition = function (x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Rotate the model around an arbitrary axis in object space
   * @param {Vector3} axis The object to be rotated
   * @param {Number} radians Angle of rotation
   */
  this.rotateAroundObjectAxis = function (axis, radians) {
    var rotObjectMatrix;
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    this.mesh.matrix.multiply(rotObjectMatrix);
    this.mesh.rotation.setFromRotationMatrix(object.matrix);
  }

  /**
   * Set the pitch
   * @param {Number} radians Angle of rotation
   */
  this.setPitch = function(radians){
    var Axis = new THREE.Vector3(1, 0, 0);
    this.rotateAroundWorldAxis(Axis,radians); 
  }

  /**
   * Set the roll
   * @param {Number} radians Angle of rotation
   */
  this.setRoll = function(radians){
    var Axis = new THREE.Vector3(0, 1, 0);
    this.rotateAroundWorldAxis(Axis,radians); 
  }

  /**
   * Set the yaw
   * @param {Number} radians Angle of rotation
   */
  this.setYaw = function(radians){
    var Axis = new THREE.Vector3(0, 0, 1);
    this.rotateAroundWorldAxis(Axis,radians); 
  }

  /**
   * Rotate the model around an arbitrary axis in world space   
   * @param {Vector3} axis Axis of rotation
   * @param {Number} radians Angle of rotation 
   */
  this.rotateAroundWorldAxis = function (axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix); // pre-multiply
    this.mesh.matrix = rotWorldMatrix;
    this.mesh.rotation.setFromRotationMatrix(object.matrix);
  }

  /**
   * Associates a toggle button with the Mesh
   * @param {String} ID HTML ID of the button
   */
  this.setToggleID = function(ID){
    toggleID = ID;
  }
  
  /**
   * Make model visible or invisible
   */
  this.toggle = function () {
    console.log('toggling');
    if (this.toggled == 0) {
      this.mesh.visible = true;
      this.toggled = 1;
    }
    else {
      this.mesh.visible = false;
      this.toggled = 0;
    }
  }

  /**
   * Delete the model from the interface
   */
  this.delete = function(){
    this.World.remove(this.mesh);
    if(toggleID !== ''){
      console.log(toggleID);
      document.getElementById(toggleID).remove();
    }
  }
};





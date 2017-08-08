/**
 * @constructor
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */
var Model = function (Environment) {
  console.log('creating ')
    var rotWorldMatrix;
  this.World = Environment.ms_Scene;

  this.toggled = 1;
  this.appearance = {color: 0xffffff };
  this.mesh;
  var xposition = [];
  var yposition = [];
  var zposition = [];
  /**
   * 
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
   * set the hex color property of appearance
   * @param {string} hexColor Color in hex
   */
  this.setColor = function (hexColor) {
    this.appearance.color = hexColor;
  }

  /**
   * Update the mesh by specifying a new 3D model file path
   * @param {String} file
   */
  this.updateMesh = function () {
    console.log('updateMesh() starting');
    model();
    console.log('updateMesh() ending');
  };

  /**
   * Update the display for the iceberg dimensions
   * @param {Number} h
   * @param {Number} w
   * @param {Number} v
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
   *  Rotate the model around an arbitrary axis in object space
   */
  this.rotateAroundObjectAxis = function (object, axis, radians) {
    var rotObjectMatrix;
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  /**
   * Set the pitch
   */
  this.setPitch = function(radians){
    var mesh = this.mesh;
    var Axis = new THREE.Vector3(1, 0, 0);
    this.rotateAroundWorldAxis(mesh,Axis,radians); 
  }

  /**
   * Set the roll
   */
  this.setRoll = function(radians){
    var mesh = this.mesh;
    var Axis = new THREE.Vector3(0, 1, 0);
    this.rotateAroundWorldAxis(mesh,Axis,radians); 
  }

  /**
   * Set the yaw
   */
  this.setYaw = function(radians){
    var mesh = this.mesh;
    var Axis = new THREE.Vector3(0, 0, 1);
    this.rotateAroundWorldAxis(mesh,Axis,radians); 
  }

  /**
   * Rotate the model around an arbitrary axis in world space    
   */
  this.rotateAroundWorldAxis = function (object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
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
   * Create the scene. TODO DELETE
   */

  function init() {

    /* SCENE */

    scene = new THREE.Scene(); // Create the scene 
    scene.background = new THREE.Color(0x222222);

    /* RENDERER */

    renderer = new THREE.WebGLRenderer(); // Create the renderer
    renderer.setClearColor(0xc4c4c4);
    renderer.setPixelRatio(window.devicePixelRatio); // tch
    /* DOM CONTAINER FOR RENDERER */

    var container = document.getElementById(modelcontainerid); //Assign the output to container
    renderer.setSize($(container).width(), $(container).height());
    container.appendChild(renderer.domElement);

    /* CLOCK */

    clock = new THREE.Clock();

    /* CAMERA */
    var VIEW_ANGLE = 75,
        ASPECT = $(container).width() / $(container).height(),
        NEAR = 0.1,
        FAR = 1000000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    //camera = new THREE.PerspectiveCamera( 60,$(container).width()/$(container).height(), 1, 1000 );
    camera.position.z = cam_z;
    camera.updateProjectionMatrix();
    controls = new THREE.TrackballControls(camera, container);
    //controls = new THREE.OrbitControls(camera);  
    controls.staticMoving = false;
    controls.enableDamping = false;
    controls.dampingFactor = 0.01;
    controls.enableZoom = true;
    controls.addEventListener('change', render); // remove when using animation loop
    // enable animation loop when using damping or autorotation

    /* LIGHTS */

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 100);
    light.intensity = 0.86;
    scene.add(light);
    var light = new THREE.DirectionalLight(0x002288);
    light.position.set(0, 0, -1);
    scene.add(light);
    var light = new THREE.DirectionalLight(0x99cfff);
    light.position.set(0, 0, 100);
    light.intensity = 0.2;
    scene.add(light);
    //
    stats = new Stats();
    container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
  }

  /**
   * Event handler for window resizing
   */
  this.onWindowResize = function () {
    var container = document.getElementById(modelcontainerid); //Assign the output to container
    camera.aspect = $(container).width() / $(container).height();
    camera.updateProjectionMatrix();
    renderer.setSize($(container).width(), $(container).height());
  }

  /**
   * Animate the model
   */
  this.animate = function () {
    requestAnimationFrame(animate);
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    stats.update();
    render();
  }

  /**
   * Render model
   */
  this.render = function () {
    renderer.render(scene, camera);
  }
  this.protoTest = function(){
    console.log('Model Prototype');
  } 
};



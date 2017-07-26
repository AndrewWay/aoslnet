/**
 * @file 3D Model Control and Viewing
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

currentfile='';
modelcontainerid='model';

/*
 * Update the mesh by specifying a new 3D model file path
 * @param {String} file
 */
function updateMesh(file){
  console.log('updateMesh() starting');
  setfile(file);
  model();
  console.log('updateMesh() ending');
}

/*
 * Set the current 3D model file
 * @param {String} file
 */
function setfile(file){
  currentfile=file;
}

/*
 * Update the display for the iceberg dimensions
 * @param {Number} h
 * @param {Number} w
 * @param {Number} v
 */
function updateDim(h,w,v){
  console.log("updateDim() running");
  console.log("h: "+h+"w: "+w+"v: "+v);
  var hTd = document.getElementById("icebergHeight");
  var wTd = document.getElementById("icebergWidth");
  var vTd = document.getElementById("icebergVolume");
  hTd.innerHTML=h;
  wTd.innerHTML=w;
  vTd.innerHTML=v;
  console.log("updateDim() done");
}

/*
 * Display 3D point cloud
 */

function addpoints() {
 
    // grab data from the INPUT elements
    var x = grab_float_data( "X" ) ;
    var y = grab_float_data( "Y" ) ;
    var z = grab_float_data( "Z" ) ;
 
    // loop through the points and add them to the scene
    for( var i=0 ; i < z.length ; i++ ) {
 
        // geometry describes the shape
        geometry = new THREE.SphereGeometry( 24, 16, 16 ) ;
 
        // material describes the surface of the shape
        material = new THREE.MeshLambertMaterial( { color:0x00CCFF } ) ;
 
        // mesh maps the material onto the geometry to make an object  
        mesh = new THREE.Mesh( geometry, material ) ;
 
        // position the mesh in space
        mesh.position.set( x[i], y[i], z[i] ) ;
 
        // add the mesh to the scene
        scene.add( mesh ) ;
    }
}

/*
 * Display 3D model
 */
function model(){  
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var stats;
  var camera, controls, scene, renderer;
  init();
  render();
  animate();
}

/*
 * Create the scene. 
 */
function init() {

  /* SCENE */

  scene = new THREE.Scene(); // Create the scene 
  scene.background = new THREE.Color( 0x222222 );
 
  /* RENDERER */

	renderer = new THREE.WebGLRenderer(); // Create the renderer
	renderer.setPixelRatio( window.devicePixelRatio ); // tch

  /* DOM CONTAINER FOR RENDERER */

	var container = document.getElementById( modelcontainerid ); //Assign the output to container
  renderer.setSize($(container).width(), $(container).height());
	container.appendChild( renderer.domElement );

  /* CAMERA */

	camera = new THREE.PerspectiveCamera( 60,$(container).width()/$(container).height(), 1, 1000 );
	camera.position.z = 500;
	camera.updateProjectionMatrix();
	controls = new THREE.TrackballControls( camera,container);
  //controls = new THREE.OrbitControls(camera);  
  controls.staticMoving = false;	
	controls.enableDamping = false;
	controls.dampingFactor = 0.01;
	controls.enableZoom = true;
  controls.addEventListener( 'change', render ); // remove when using animation loop
	// enable animation loop when using damping or autorotation
  /* GEOMETRY */

  var loader = new THREE.STLLoader();
  loader.load(currentfile, function ( geometry ) {
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.material.side = THREE.DoubleSide;
    scene.add( mesh );
  });

	/* LIGHTS */

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 100 );
  light.intensity=0.86;
	scene.add( light );
	var light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( 0, 0, -1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0x99cfff);
  light.position.set(0,0,100);
  light.intensity=0.2;
	scene.add( light );
	//
	stats = new Stats();
	container.appendChild( stats.dom );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

/*
 * Event handler for window resizing
 */
function onWindowResize() {
  var container = document.getElementById( modelcontainerid ); //Assign the output to container
	camera.aspect = $(container).width()/$(container).height();
	camera.updateProjectionMatrix();
	renderer.setSize( $(container).width(), $(container).height());
}

/*
 * Function for animating the scene
 */
function animate() {
  requestAnimationFrame( animate );
	controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	stats.update();
	render();
}

/*
 * Render the scene with a specified camera
 */
function render() {
  renderer.render( scene, camera );
}

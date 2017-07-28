/**
 * @file 3D Model Control and Viewing
 * @author Andrew Way <arw405@mun.ca>
 * @version 0.1
 */

currentfile='';
modelcontainerid='model';
xarr=[];
yarr=[];
zarr=[];
cam_z=500;
meshtoggled=1;
pointstoggled=1;
var mesh;
/*
 * Update the mesh by specifying a new 3D model file path
 * @param {String} file
 */
function updateMesh(){
	console.log('updateMesh() starting');
	model();
	console.log('updateMesh() ending');
}


/*
 * Set the current 3D model filepath on the public directory
 * @param {String} file
 */
function setfile(file){
	currentfile=file;
}

function setPointCloud(x,y,z){
	console.log('setting the point cloud arrays in model.js');
	console.log(x);
	console.log(y);
	console.log(z);

	xarr=x;
	yarr=y;
	zarr=z;
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
 * Display 3D model
 */
function createScene(){  
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var stats;
	var camera, controls, scene, renderer;
	init();
	render();
	animate();
}

/*
 * Load and display 3D point cloud
 */
function loadPointCloud() {
	console.log('adding point cloud');
	// grab data from the input elements
	var x = xarr ;
	var y = yarr ;
	var z = zarr ;
	var geometry = new THREE.Geometry();
	var materials;
	// loop through the points and add them to the scene
	for( var i=0 ; i < z.length ; i++ ) {
		// geometry describes the shape
		var vertex = new THREE.Vector3();
		vertex.x=x[i];
		vertex.y=y[i];
		vertex.z=z[i];
		geometry.vertices.push(vertex);
	}
	var size=4;
	var color=[1,1,0.5];
	materials = new THREE.PointCloudMaterial({size: size});
	pointcloud = new THREE.PointCloud(geometry,materials);
	scene.add(pointcloud);
}
function setSDModelPosition(x,y,z){
  SDModel.position.set(x, y, z);
}
function loadSeaDragon(){
  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  SDModel = new THREE.Mesh( geometry, material );
  scene.add( SDModel );
}
/*
 * Load and add the mesh to the scene
 */
function loadModel(){
	/* GEOMETRY */
	var loader = new THREE.STLLoader();
	loader.load(currentfile, function ( geometry ) {
			var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
			mesh = new THREE.Mesh( geometry, material );
			mesh.material.side = THREE.DoubleSide;
			scene.add( mesh );
			});
}
/*
 * Make mesh visible or invisible
 */
function toggleMesh(){
	if (meshtoggled == 0){
		mesh.visible=true;
		meshtoggled=1;
	}
	else{
		mesh.visible=false;
		meshtoggled=0;
	}
}

/*
 * Make points visible or invisible
 */
function togglePoints(){
	if (pointstoggled == 0){
		pointcloud.visible=true;
		pointstoggled=1;
	}
	else{
		pointcloud.visible=false;
		pointstoggled=0;
	}
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
	var VIEW_ANGLE = 75, 
	    ASPECT = $(container).width()/$(container).height(), 
	    NEAR = 0.1, FAR = 1000000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );

	//camera = new THREE.PerspectiveCamera( 60,$(container).width()/$(container).height(), 1, 1000 );
	camera.position.z = cam_z;
	camera.updateProjectionMatrix();
	controls = new THREE.TrackballControls( camera,container);
	//controls = new THREE.OrbitControls(camera);  
	controls.staticMoving = false;	
	controls.enableDamping = false;
	controls.dampingFactor = 0.01;
	controls.enableZoom = true;
	controls.addEventListener( 'change', render ); // remove when using animation loop
	// enable animation loop when using damping or autorotation


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



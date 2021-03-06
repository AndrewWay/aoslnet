

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var stats;
var camera, controls, scene, renderer;
init();
render();
 // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {

  /* SCENE */

  scene = new THREE.Scene(); // Create the scene 
  scene.background = new THREE.Color( 0x222222 );
  /* RENDERER */

	renderer = new THREE.WebGLRenderer(); // Create the renderer
	//renderer.setClearColor( scene.fog.color ); //Set the clear color ?
	renderer.setPixelRatio( window.devicePixelRatio ); // tch
	renderer.setSize( window.innerWidth, window.innerHeight ); //tch

  /* DOM CONTAINER FOR RENDERER */

	var container = document.getElementById( 'container' ); //Assign the output to container
	container.appendChild( renderer.domElement );

  /* CAMERA */

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 500;
  console.log('Creating trackballcontrols');
	controls = new THREE.TrackballControls( camera );
  //controls = new THREE.OrbitControls(camera);  
  controls.staticMoving = false;	
	controls.enableDamping = false;
	controls.dampingFactor = 0.01;
	controls.enableZoom = true;
  controls.addEventListener( 'change', render ); // remove when using animation loop
	// enable animation loop when using damping or autorotation
  console.log('trackball created');
  /* GEOMETRY */

  var loader = new THREE.STLLoader();
  loader.load( './data/r11i02.stl', function ( geometry ) {
    console.log('I am in the function?');
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.material.side = THREE.DoubleSide;
    scene.add( mesh );
  });

    console.log('STL loaded');
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

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
	controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	stats.update();
	render();
}

function render() {
  renderer.render( scene, camera );
}

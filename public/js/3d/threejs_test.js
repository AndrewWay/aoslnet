

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var stats;
var camera, controls, scene, renderer;
init();
render();
 // remove when using next line for animation loop (requestAnimationFrame)
//animate();

function init() {
  scene = new THREE.Scene(); // Create the scene 
 // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 ); // Create the fog
	renderer = new THREE.WebGLRenderer(); // Create the renderer
	//renderer.setClearColor( scene.fog.color ); //Set the clear color ?
	renderer.setPixelRatio( window.devicePixelRatio ); // tch
	renderer.setSize( window.innerWidth, window.innerHeight ); //tch
	var container = document.getElementById( 'container' ); //Assign the output to container
	container.appendChild( renderer.domElement );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 500;
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // remove when using animation loop
	// enable animation loop when using damping or autorotation
	//controls.enableDamping = true;
	//controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	
	// world
  //getJSON(url);
  
  console.log("Distributing Data");
  
  var geom = new THREE.Geometry();
  var url = 'bergs/data/2017/DEREK';
  var json = getJSON(url);
  console.log('x: '+json[0].x);
  console.log('y: '+json[0].y);
  console.log('z: '+json[0].z);

  x=json[0].x;
  y=json[0].y;
  z=json[0].z;
  var scale=1;

  //Scale our data
  for(i=0;i<y.length;i++){
    var xtmp=x[i];
    var ytmp=y[i];
    var ztmp=z[i];

    x[i]=scale*xtmp;
    y[i]=scale*ytmp;
    z[i]=scale*ztmp;
  }

  var f=0;

  for(i=0;i<y.length;i++){
    newx=x[i];
    newy=y[i];
    newz=z[i];
    console.log("ADDING: x "+newx+" y "+newy+" z "+newz);
    var v = new THREE.Vector3(newx,newy,newz);
    geom.vertices.push(v);
  }

  for(i=2;i<y.length;i++){
    geom.faces.push( new THREE.Face3( i-2, i-1, i ) );
    geom.faces.push( new THREE.Face3( i-1, i-2, i ) );
    geom.computeFaceNormals();    
  }

  // Create the material
  var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
  var mesh = new THREE.Mesh( geom, material );
  mesh =  new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
	mesh.position.x = 0;
	mesh.position.y = 0;
	mesh.position.z = 0;
	mesh.updateMatrix();
	mesh.matrixAutoUpdate = false;
  scene.add( mesh );

	// lights
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );
	var light = new THREE.AmbientLight( 0x222222 );
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

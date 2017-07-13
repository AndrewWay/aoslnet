

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
  url='/bergs/test';
  var request = new XMLHttpRequest();
  request.open("GET",url,false);
  request.send(null);
  console.log('database returned: '+request.responseText);

    var s = request.responseText;
  // "stl" represents a raw STL binary read from HTTP response data
  var parseStlBinary = parsebinary(s);
  console.log('finished!');
  x=[];
  y=[];
  z=[];

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

function parsebinary(stl) {
    console.log('hello!');  
    // create three.js geometry object, discussed later
    var geo = new THREE.Geometry();
    // The stl binary is read into a DataView for processing
    var dv = new DataView(stl, 80); // 80 == unused header
    var isLittleEndian = true;

    // Read a 32 bit unsigned integer
    var triangles = dv.getUint32(0, isLittleEndian);

    var offset = 4;
    for (var i = 0; i < triangles; i++) {
      // Get the normal for this triangle by reading 3 32 but floats
      var normal = new THREE.Vector3(
        dv.getFloat32(offset, isLittleEndian),
        dv.getFloat32(offset+4, isLittleEndian),
        dv.getFloat32(offset+8, isLittleEndian)
      );
      offset += 12;

      // Get all 3 vertices for this triangle, each represented
      // by 3 32 bit floats.
      for (var j = 0; j < 3; j++) {
        geo.vertices.push(
          new THREE.Vector3(
            dv.getFloat32(offset, isLittleEndian),
            dv.getFloat32(offset+4, isLittleEndian),
            dv.getFloat32(offset+8, isLittleEndian)
          )
        );
        offset += 12
      }
      // there's also a Uint16 "attribute byte count" that we
      // don't need, it should always be zero.
      offset += 2;

      // Create a new face for from the vertices and the normal
      geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2, normal));
    }
    // continue parsing STL faces for rendering...
};
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

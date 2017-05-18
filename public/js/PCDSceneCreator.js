/*function PCDInit(){
    if ( ! Detector.webgl ) 
        Detector.addGetWebGLMessage();
    var container, stats;
    var camera, controls, scene, renderer;
    init();
    animate();
}

function init() {
    var parentToPCDViewer = document.getElementById("PCDviewer");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.01, 40 );
    camera.position.x = 0.4;
    camera.position.z = -2;
    camera.up.set(0,0,1);
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 0.3;
    controls.panSpeed = 0.2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.minDistance = 0.3;
    controls.maxDistance = 0.3 * 100;
    scene.add( camera );
    var axisHelper = new THREE.AxisHelper( 0.1 );
    scene.add( axisHelper );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 500,500 );
    parentToPCDViewer.appendChild( renderer.domElement );
    var loader = new THREE.PCDLoader();
    loader.load( "/DataReceived/2017/01256/Zaghetto.pcd", function ( mesh ) {
        scene.add( mesh );
        var center = mesh.geometry.boundingSphere.center;
        controls.target.set( center.x, center.y, center.z);
        controls.update();
    } );
    container = document.createElement( 'div' );
    parentToPCDViewer.appendChild( container );
    container.appendChild( renderer.domElement );
    //parentToPCDViewer.appendChild( renderer.domElement );//VSO
    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('keydown', keyboard);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}
function keyboard ( ev ) {
    var ZaghettoMesh = scene.getObjectByName( "Zaghetto.pcd" );
    switch ( ev.key ) {
        case '+':
            ZaghettoMesh.material.size*=1.2;
            ZaghettoMesh.material.needsUpdate = true;
            break;
        case '-':
            ZaghettoMesh.material.size/=1.2;
            ZaghettoMesh.material.needsUpdate = true;
            break;
        case 'c':
            ZaghettoMesh.material.color.setHex(Math.random()*0xffffff);
            ZaghettoMesh.material.needsUpdate = true;
            break;
    }
}
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    stats.update();
}*/
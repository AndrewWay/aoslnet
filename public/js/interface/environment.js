//Environment
modelcontainerid='model';
var clock = new THREE.Clock();
var tuniform = {
	iGlobalTime: {
		type: 'f',
		value: 0.1
	},
	iResolution: {
		type: 'v2',
		value: new THREE.Vector2()
	},
	iMouse: {
		type: 'v4',
		value: new THREE.Vector2()
	}
};
// init camera, scene, renderer
var scene, camera, renderer;
function waterInit(){

scene = new THREE.Scene();
var fov = 75,
		aspect = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.z = 100;


camera.lookAt(scene.position);



renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xc4c4c4);
var container = document.getElementById( modelcontainerid ); //Assign the output to container
renderer.setSize($(container).width(), $(container).height());
container.appendChild( renderer.domElement );


tuniform.iResolution.value.x = window.innerWidth;
tuniform.iResolution.value.y = window.innerHeight;
// Create Plane
var material = new THREE.ShaderMaterial({
	uniforms: tuniform,
	vertexShader: document.getElementById('vertex-shader').textContent,
	fragmentShader: document.getElementById('fragment-shader').textContent
});
var mesh = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40), material
);
scene.add(mesh);
waterRender();

}
// draw animation
function waterRender(time) {
	tuniform.iGlobalTime.value += clock.getDelta();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}



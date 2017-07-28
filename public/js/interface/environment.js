//Environment

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



function loadWater(){



var material = new THREE.ShaderMaterial({
	uniforms: tuniform,
	vertexShader: document.getElementById('vertex-shader').textContent,
	fragmentShader: document.getElementById('fragment-shader').textContent
});
var water = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40), material
);
scene.add(water);

}

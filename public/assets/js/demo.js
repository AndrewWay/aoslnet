waterNormal_source='../assets/img/waternormals.jpg';

var DEMO = {
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_Controls: null,
	ms_Water: null,
	ms_FilesDND: null,
	ms_Raycaster: null,
	ms_Clickable: [],

    enable: (function enable() {
        try {
            var aCanvas = document.createElement('canvas');
            return !! window.WebGLRenderingContext && (aCanvas.getContext('webgl') || aCanvas.getContext('experimental-webgl'));
        }
        catch(e) {
            return false;
        }
    })(),
	
	initialize: function initialize(inIdCanvas, inParameters) {
		this.ms_Canvas = $('#'+inIdCanvas);
		var container=document.getElementById(inIdCanvas);
		// Initialize Renderer, Camera, Projector and Scene
		this.ms_Renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		this.ms_Renderer.setClearColor( 0x000000, 1.0);
		this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.ms_Scene = new THREE.Scene();
					// FOG
		//this.ms_Scene.fog = new THREE.FogExp2( 0xCCCFFF, 0.007);
    //this.ms_Scene.fog.color.setHSL( 0.51, 0.6, 0.6 );
		
			
		var VIEW_ANGLE = 55.0, 
	    ASPECT = $(container).width()/$(container).height(), 
	    NEAR = 0.5, FAR = 3000000;
	  this.ms_Camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	

		this.ms_Camera.position.set(100, 0, 200);// Math.max(inParameters.width * 1.5, inParameters.height) / 8, -inParameters.height);

    //Orient the camera frame of reference
    this.ms_Camera.up.x = 0;
    this.ms_Camera.up.y = 0;
    this.ms_Camera.up.z = 1;
		this.ms_Camera.lookAt(new THREE.Vector3(0, -1, -1));
    
		this.ms_Raycaster = new THREE.Raycaster();
		
		// Initialize Orbit control		
		this.ms_Controls = new THREE.OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);
		//this.ms_Controls.userPan = true;
		//this.ms_Controls.userPanSpeed = 0.0;
		//this.ms_Controls.maxDistance = 5000.0;
		this.ms_Controls.maxPolarAngle = Math.PI;
	  //this.ms_Controls.minAzimuthAngle = 0; // radians
   // this.ms_Controls.maxAzimuthAngle = 0; // radians
    this.ms_Controls.enableDamping = true;
    this.ms_Controls.dampingFactor = 0.01;
    
	  /* TRACKBALL */
	  /*this.ms_Controls = new THREE.TrackballControls(this.ms_Camera, this.ms_Renderer.domElement);
    this.ms_Controls.staticMoving = false;
    this.ms_Controls.enableDamping = false;
    this.ms_Controls.dampingFactor = 0.01;
    this.ms_Controls.enableZoom = true;*/
    
		// Add light
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(-600, 300, 600);
		this.ms_Scene.add(directionalLight);
		var ambientLight = new THREE.AmbientLight('#555555');
		ambientLight.position.set(0,500,0);
		this.ms_Scene.add(ambientLight);
		
		// Create terrain - Don't need this
		//this.loadTerrain(inParameters);
		// Load textures		
		var waterNormals = new THREE.ImageUtils.loadTexture(waterNormal_source);
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
		
		// Load filesdnd texture
		new Konami(function() {
			if(DEMO.ms_FilesDND == null)
			{
				var aTextureFDND = THREE.ImageUtils.loadTexture("assets/img/filesdnd_ad.png");
				aTextureFDND.minFilter = THREE.LinearFilter;
				DEMO.ms_FilesDND = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ map : aTextureFDND, transparent: true, side : THREE.DoubleSide }));

				// Mesh callback
				DEMO.ms_FilesDND.callback = function() { window.open("http://www.filesdnd.com"); }
				DEMO.ms_Clickable.push(DEMO.ms_FilesDND);
				
				DEMO.ms_FilesDND.position.y = 1200;
				DEMO.ms_Scene.add(DEMO.ms_FilesDND);
			}
		});
		
		// Create the water effect
		this.ms_Water = new THREE.Water(this.ms_Renderer, this.ms_Camera, this.ms_Scene, {
			textureWidth: 512, 
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0
		});
		var aMeshMirror = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(inParameters.width * 500, inParameters.height * 500, 10, 10), 
			this.ms_Water.material
		);
		aMeshMirror.add(this.ms_Water);
	//	aMeshMirror.rotation.x = - Math.PI * 0.5;
		this.ms_Scene.add(aMeshMirror);

		this.loadSkyBox();
	},
	
	loadSkyBox: function loadSkyBox() {
		var aCubeMap = THREE.ImageUtils.loadTextureCube([
		  'assets/img/px.jpg',
		  'assets/img/nx.jpg',
		  'assets/img/py.jpg',
		  'assets/img/ny.jpg',
		  'assets/img/pz.jpg',
		  'assets/img/nz.jpg'
		]);
		aCubeMap.format = THREE.RGBFormat;

		var aShader = THREE.ShaderLib['cube'];
		aShader.uniforms['tCube'].value = aCubeMap;

		var aSkyBoxMaterial = new THREE.ShaderMaterial({
		  fragmentShader: aShader.fragmentShader,
		  vertexShader: aShader.vertexShader,
		  uniforms: aShader.uniforms,
		  depthWrite: false,
		  side: THREE.BackSide
		});

		var aSkybox = new THREE.Mesh(
		  new THREE.BoxGeometry(1000000, 1000000, 1000000),
		  aSkyBoxMaterial
		);
		/*var rotObjectMatrix;
		var axis = new THREE.Vector3(1,0,0);
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), Math.PI / 2);
    aSkybox.matrix.multiply(rotObjectMatrix);
    aSkybox.rotation.setFromRotationMatrix(aSkybox.matrix);
*/
		this.ms_Scene.add(aSkybox);
	},
	
	loadTerrain: function loadTerrain(inParameters) {
		var terrainGeo = TERRAINGEN.Get(inParameters);
		var terrainMaterial = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shading: THREE.FlatShading, side: THREE.DoubleSide });
		
		var terrain = new THREE.Mesh(terrainGeo, terrainMaterial);
		terrain.position.y = - inParameters.depth * 0.4;
		this.ms_Scene.add(terrain);
	},
	
	display: function display() {
		this.ms_Water.render();
		this.ms_Renderer.render(this.ms_Scene, this.ms_Camera);
	},
	
	update: function update() {
		if (this.ms_FilesDND != null) {
			this.ms_FilesDND.rotation.y += 0.01;
		}
		this.ms_Water.material.uniforms.time.value += 1.0 / 60.0;
		this.ms_Controls.update();
		this.display();
	},
	
	resize: function resize(inWidth, inHeight) {
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize(inWidth, inHeight);
		this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.display();
	}
};



var Mesh = (function(){
    var Mesh = Object.create(Model);
    var modelMesh;

    /**
     * Load and add the mesh to the scene
     */
    Mesh.loadModel = function(){
    var loader = new THREE.STLLoader();
    loader.load(this.sourcefile, function ( geometry ) {
      var material = new THREE.MeshPhongMaterial( this.appearance.color );
      modelMesh = new THREE.Mesh( geometry, material );
      modelMesh.material.side = THREE.DoubleSide;
      var Axis = new THREE.Vector3(1,0,0);
      rotationAngle=-90*Math.PI/180;//Rotate by 90 degree
      World.add( modelMesh );
      rotateAroundWorldAxis(modelMesh, Axis,rotationAngle);
      });
    }

    /**
     * Set the current 3D model filepath on the public directory
     * @param {String} file
     */
    Mesh.setfile = function(file){
      this.setfile=file;
    };

    return Mesh;
})();



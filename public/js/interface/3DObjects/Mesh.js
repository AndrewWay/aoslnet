/**
 * @constructor
 */
function Mesh(sourceFile){
  function MeshObject(){
    this.sourceFile = sourceFile;
    this.__proto__ = new Model(DEMO);
    
    /**
     * Set the current 3D model filepath on the public directory
     * @param {String} file Filepath to the 3D model
     */
    this.setFile = function(file){
      this.sourceFile = file;
    }

    /**
     * Return the path to the source file
     * @return {String} Path to source file
     */
    this.getFile = function(){
      return this.sourceFile;
    }

    /**
     * Load and add the mesh to the scene
     */
    this.loadModel = function () {
      var loader = new THREE.STLLoader();
      var MeshObject = this;
      loader.load(MeshObject.sourceFile, function (geometry) {
          MeshObject.material = new THREE.MeshPhongMaterial(MeshObject.appearance);
          MeshObject.material.shading = THREE.SmoothShading;
          MeshObject.mesh = new THREE.Mesh(geometry, MeshObject.material);
          MeshObject.mesh.material.side = THREE.DoubleSide;
          MeshObject.World.add(MeshObject.mesh);
          });
    }

    /**
     * Load and add an .obj file to scene
     * Not used
     */
    this.loadOBJ = function(rotationAngle){
      var loader = new THREE.OBJLoader();
      var MeshObject = this;
      loader.load( MeshObject.sourceFile, function ( geometry ) {
          MeshObject.mesh = geometry;
          MeshObject.World.add( geometry );
          } );
    }
  }
  return new MeshObject();
}












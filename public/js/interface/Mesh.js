/**
 * @constructor
 */
function Mesh(Model){
  function MeshObject(){
    this.__proto__ = Model;
    console.log('MODEL WORLD');
    console.log(Model.World);
    console.log('MESH WORLD');
    console.log(this.World);
    /**
     * Set the current 3D model filepath on the public directory
     * @param {String} file
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
      console.log('SOURCEFILE '+MeshObject.sourceFile);
      loader.load(MeshObject.sourceFile, function (geometry) {
          MeshObject.material = new THREE.MeshPhongMaterial(MeshObject.appearance);
          MeshObject.mesh = new THREE.Mesh(geometry, MeshObject.material);
          MeshObject.mesh.material.side = THREE.DoubleSide;
          var Axis = new THREE.Vector3(1, 0, 0);
          MeshObject.rotationAngle = -90 * Math.PI / 180; //Rotate by 90 degree
          MeshObject.World.add(MeshObject.mesh);
          MeshObject.rotateAroundWorldAxis(MeshObject.mesh, Axis, MeshObject.rotationAngle);
          });

    }
  }
  return new MeshObject();
}










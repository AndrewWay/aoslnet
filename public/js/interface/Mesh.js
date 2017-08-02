var Mesh = function (sourceFile) {
  var M = new Model();
  M.file = sourceFile;

  /**
   * Load and add the mesh to the scene
   */
  M.loadModel = function () {
    var loader = new THREE.STLLoader();

    loader.load(M.file, function (geometry) {
      var material = new THREE.MeshPhongMaterial(M.appearance);
      M.mesh = new THREE.Mesh(geometry, material);
      M.mesh.material.side = THREE.DoubleSide;
      var Axis = new THREE.Vector3(1, 0, 0);
      M.rotationAngle = -90 * Math.PI / 180; //Rotate by 90 degree
      M.World.add(M.mesh);
      M.rotateAroundWorldAxis(M.mesh, Axis, rotationAngle);
    });
  }

  /**
   * Set the current 3D model filepath on the public directory
   * @param {String} file
   */
  M.setfile = function (file) {
    this.file = file;
  };

  return M;
};

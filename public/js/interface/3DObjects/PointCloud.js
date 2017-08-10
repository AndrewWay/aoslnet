/**
 * @constructor
 */
var PointCloud = function (x,y,z) {
  function PointCloudObject(){
    this.__proto__ = new Model(DEMO);

    this.pcd_x = x;
    this.pcd_y = y;
    this.pcd_z = z;
    /**
     * Add 3D point cloud object
     */
    this.loadPointCloud = function () {
      console.log('adding point cloud');
      // grab data from the input elements
      var geometry = new THREE.Geometry();
      var materials;
     /* var pcd_x = this.pcd_x;
      var pcd_y = this.pcd_y;
      var pcd_z = this.pcd_z;*/
      
      // loop through the points and add them to the scene
      for (var i = 0; i < z.length; i++) {
        // geometry describes the shape
        var vertex = new THREE.Vector3();
        vertex.x = this.pcd_x[i];
        vertex.y = this.pcd_y[i];
        vertex.z = this.pcd_z[i];
        geometry.vertices.push(vertex);
      }
      var size = 0.5;
      var color = [1, 1, 0.5];
      var materials = new THREE.PointCloudMaterial({size: size});
      this.mesh = new THREE.PointCloud(geometry, materials);
      this.World.add(this.mesh); //scene.add(pointcloud);
      var Axis = new THREE.Vector3(1, 0, 0);
      rotationAngle = -90 * Math.PI / 180; //Rotate by 90 degree
      this.rotateAroundWorldAxis(this.mesh, Axis, rotationAngle);
    }

    /**
     * Set the xyz point cloud data arrays
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    this.setPointCloud = function (x, y, z) {
      this.pcd_x = x;
      this.pcd_y = y;
      this.pcd_z = z;
    }
  }
  return new PointCloudObject();
};



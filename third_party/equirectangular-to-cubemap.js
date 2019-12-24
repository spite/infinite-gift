import {
  Scene,
  CubeCamera,
  MeshBasicMaterial,
  Mesh,
  IcosahedronGeometry,
  BackSide
} from "./three.module.js";

class EquirectangularToCubemap {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new Scene();

    var gl = this.renderer.getContext();
    this.maxSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

    this.camera = new CubeCamera(1, 100000, 1);

    this.material = new MeshBasicMaterial({
      map: null,
      side: BackSide
    });

    this.mesh = new Mesh(new IcosahedronGeometry(100, 4), this.material);
    this.scene.add(this.mesh);
  }

  convert(source, size) {
    var mapSize = Math.min(size, this.maxSize);
    this.camera = new CubeCamera(1, 100000, mapSize);
    this.material.map = source;

    this.camera.update(this.renderer, this.scene);

    return this.camera.renderTarget.texture;
  }
}

export { EquirectangularToCubemap };

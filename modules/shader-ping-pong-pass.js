import {
  Scene,
  WebGLRenderTarget,
  RepeatWrapping,
  LinearFilter,
  LinearMipMapLinearFilter,
  RGBAFormat,
  UnsignedByteType,
  OrthographicCamera,
  PlaneBufferGeometry,
  Mesh,
} from '../third_party/three.module.js';

class ShaderPingPongPass {

  constructor(renderer, shader, width, height, format, type, minFilter, magFilter, wrapS, wrapT) {

    this.renderer = renderer;
    this.shader = shader;
    this.orthoScene = new Scene();
    this.fbo = new WebGLRenderTarget(width, height, {
      wrapS: wrapS || RepeatWrapping,
      wrapT: wrapT || RepeatWrapping,
      minFilter: minFilter || LinearMipMapLinearFilter,
      magFilter: magFilter || LinearFilter,
      format: format || RGBAFormat,
      type: type || UnsignedByteType
    });
    this.fbos = [this.fbo, this.fbo.clone()];
    this.currentFBO = 0;
    this.orthoCamera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, .00001, 1000);
    this.orthoQuad = new Mesh(new PlaneBufferGeometry(1, 1), this.shader);
    this.orthoQuad.scale.set(width, height, 1.);
    this.orthoScene.add(this.orthoQuad);
    this.texture = this.fbo.texture;

  }

  render(final) {

    this.renderer.render(this.orthoScene, this.orthoCamera, final ? null : this.fbos[1 - this.currentFBO]);
    this.currentFBO = 1 - this.currentFBO;

  }

  setSize(width, height) {

    this.orthoQuad.scale.set(width, height, 1.);

    this.fbos[0].setSize(width, height);
    this.fbos[1].setSize(width, height);

    this.orthoQuad.scale.set(width, height, 1);

    this.orthoCamera.left = -width / 2;
    this.orthoCamera.right = width / 2;
    this.orthoCamera.top = height / 2;
    this.orthoCamera.bottom = -height / 2;
    this.orthoCamera.updateProjectionMatrix();

  }

}

export { ShaderPingPongPass };
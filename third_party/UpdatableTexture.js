import {
  Texture,
  LinearFilter,
  LinearMipMapLinearFilter,
  WebGLUtils
} from "./three.module.js";

function UpdatableTexture(
  format,
  type,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  anisotropy,
  encoding
) {
  Texture.call(
    this,
    null,
    mapping,
    wrapS,
    wrapT,
    magFilter,
    minFilter,
    format,
    type,
    anisotropy,
    encoding
  );

  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  var ctx = canvas.getContext("2d");
  var imageData = ctx.createImageData(1, 1);

  this.image = imageData;

  this.magFilter = magFilter !== undefined ? magFilter : LinearFilter;
  this.minFilter =
    minFilter !== undefined ? minFilter : LinearMipMapLinearFilter;

  this.generateMipmaps = true;
  this.flipY = true;
  this.unpackAlignment = 1;
  this.needsUpdate = true;
}

UpdatableTexture.prototype = Object.create(Texture.prototype);
UpdatableTexture.prototype.constructor = UpdatableTexture;

UpdatableTexture.prototype.isUpdatableTexture = true;

UpdatableTexture.prototype.setRenderer = function(renderer) {
  this.renderer = renderer;
  this.gl = this.renderer.getContext();
  this.utils = WebGLUtils(
    this.gl,
    this.renderer.extensions,
    this.renderer.capabilities
  );
};

UpdatableTexture.prototype.setSize = function(width, height) {
  if (width === this.width && height === this.height) return;

  var textureProperties = this.renderer.properties.get(this);
  if (!textureProperties.__webglTexture) return;

  this.width = width;
  this.height = height;

  var activeTexture = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
  this.gl.bindTexture(this.gl.TEXTURE_2D, textureProperties.__webglTexture);
  if (!textureProperties.__webglTexture) this.width = null;
  this.gl.texImage2D(
    this.gl.TEXTURE_2D,
    0,
    this.utils.convert(this.format),
    width,
    height,
    0,
    this.utils.convert(this.format),
    this.utils.convert(this.type),
    null
  );
  this.gl.bindTexture(this.gl.TEXTURE_2D, activeTexture);
};

UpdatableTexture.prototype.update = function(src, x, y) {
  var textureProperties = this.renderer.properties.get(this);
  if (!textureProperties.__webglTexture) return;

  var activeTexture = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
  this.gl.bindTexture(this.gl.TEXTURE_2D, textureProperties.__webglTexture);
  this.gl.texSubImage2D(
    this.gl.TEXTURE_2D,
    0,
    x,
    this.height - y - src.height,
    this.utils.convert(this.format),
    this.utils.convert(this.type),
    src
  );
  this.gl.generateMipmap(this.gl.TEXTURE_2D);
  this.gl.bindTexture(this.gl.TEXTURE_2D, activeTexture);
};

export { UpdatableTexture };

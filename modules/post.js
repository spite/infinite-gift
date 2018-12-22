import {
  RawShaderMaterial,
  Vector2,
  RGBAFormat,
  UnsignedByteType,
  LinearFilter,
  ClampToEdgeWrapping,
} from '../third_party/three.module.js';
import { Maf } from './maf.js';

import { getFBO } from './fbo.js';
import orthoVertexShader from '../shaders/ortho.js';
import { ShaderPass } from './shader-pass.js';
import { ShaderPingPongPass } from './shader-ping-pong-pass.js';

import { fs as highlightFragmentShader } from '../shaders/highlight-fs.js';
import { fs as dofFragmentShader } from '../shaders/dof-fs.js';
import { fs as combineFragmentShader } from '../shaders/combine-fs.js';
import { fs as finalFragmentShader } from '../shaders/final-fs.js';
import { fs as blurFragmentShader } from '../shaders/blur-fs.js';
import { fs as finalColorFragmentShader } from '../shaders/final-color-fs.js';

function Post(renderer, params = {}) {

  const w = renderer.getSize().width;
  const h = renderer.getSize().height;

  const colorFBO = getFBO(w, h);
  const depthFBO = getFBO(w, h);
  const resolution = new Vector2(w, h);

  const dofShader = new RawShaderMaterial({
    uniforms: {
      inputTexture: { value: colorFBO.texture },
      depthTexture: { value: depthFBO.texture },
      resolution: { value: resolution },
      direction: { value: new Vector2(0, 1) }
    },
    vertexShader: orthoVertexShader,
    fragmentShader: dofFragmentShader,
  });
  const dofPass = new ShaderPingPongPass(renderer, dofShader, w, h, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);

  const highlightShader = new RawShaderMaterial({
    uniforms: {
      inputTexture: { value: dofPass.fbo.texture },
    },
    vertexShader: orthoVertexShader,
    fragmentShader: highlightFragmentShader,
  });
  const highlightPass = new ShaderPass(renderer, highlightShader, w, h, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);

  const blurPasses = [];
  const levels = 5;
  const blurShader = new RawShaderMaterial({
    uniforms: {
      inputTexture: { value: null },
      resolution: { value: new Vector2(1, 1) },
      direction: { value: new Vector2(0, 1) }
    },
    vertexShader: orthoVertexShader,
    fragmentShader: blurFragmentShader,
  });
  let tw = 1;
  let th = 1;
  for (let i = 0; i < levels; i++) {
    const blurPass = new ShaderPingPongPass(renderer, blurShader, tw, th, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);
    blurPasses.push(blurPass);
  }

  const combineShader = new RawShaderMaterial({
    uniforms: {
      resolution: { value: resolution },
      inputTexture: { value: dofPass.fbo.texture },
      blur1Texture: { value: blurPasses[0].fbo.texture },
      blur2Texture: { value: blurPasses[1].fbo.texture },
      blur3Texture: { value: blurPasses[2].fbo.texture },
      blur4Texture: { value: blurPasses[3].fbo.texture },
      blur5Texture: { value: blurPasses[4].fbo.texture },
      time: { value: 0 }
    },
    vertexShader: orthoVertexShader,
    fragmentShader: combineFragmentShader,
  });
  const combinePass = new ShaderPass(renderer, combineShader, w, h, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);

  const finalShader = new RawShaderMaterial({
    uniforms: {
      resolution: { value: resolution },
      vignetteBoost: { value: .5 },
      vignetteReduction: { value: .75 },
      inputTexture: { value: combinePass.fbo.texture },
    },
    vertexShader: orthoVertexShader,
    fragmentShader: finalFragmentShader,
  });
  const finalPass = new ShaderPass(renderer, finalShader, w, h, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);

  const finalColorShader = new RawShaderMaterial({
    uniforms: {
      resolution: { value: resolution },
      time: { value: 0 },
      inputTexture: { value: finalPass.fbo.texture },
    },
    vertexShader: orthoVertexShader,
    fragmentShader: finalColorFragmentShader,
  });
  const finalColorPass = new ShaderPass(renderer, finalColorShader, w, h, RGBAFormat, UnsignedByteType, LinearFilter, LinearFilter, ClampToEdgeWrapping, ClampToEdgeWrapping);

  function render(scene, camera, boxes) {

    renderer.setClearColor(0xffffff, 1);
    boxes.forEach((b) => {
      b.mesh.box.material = b.mesh.colorMaterial;
      b.mesh.lid.material = b.mesh.colorMaterial;
    });
    renderer.render(scene, camera, colorFBO);

    renderer.setClearColor(0, 0);
    boxes.forEach((b) => {
      b.mesh.box.material = b.mesh.depthMaterial;
      b.mesh.lid.material = b.mesh.depthMaterial;
    });
    renderer.render(scene, camera, depthFBO);

    dofPass.shader.uniforms.inputTexture.value = colorFBO.texture;
    for (let j = 0; j < 4; j++) {
      dofPass.shader.uniforms.direction.value.set(1, 0);
      dofPass.render();
      dofPass.shader.uniforms.inputTexture.value = dofPass.fbos[dofPass.currentFBO].texture;
      dofPass.shader.uniforms.direction.value.set(0, 1);
      dofPass.render();
      dofPass.shader.uniforms.inputTexture.value = dofPass.fbos[dofPass.currentFBO].texture;
    }
    highlightPass.render();

    let offset = 1;
    blurShader.uniforms.inputTexture.value = highlightPass.fbo.texture;
    for (let j = 0; j < levels; j++) {
      const blurPass = blurPasses[j];
      blurShader.uniforms.direction.value.set(offset, 0);
      blurShader.uniforms.resolution.value.set(blurPass.width * 2, blurPass.height * 2);
      blurPass.render();
      blurShader.uniforms.inputTexture.value = blurPass.fbos[blurPass.currentFBO].texture;
      blurShader.uniforms.direction.value.set(0, offset);
      blurPass.render();
      blurShader.uniforms.inputTexture.value = blurPass.fbos[blurPass.currentFBO].texture;
    }

    combinePass.render();
    finalPass.render();
    finalColorPass.shader.uniforms.time.value = performance.now();
    finalColorPass.render(true);
  }

  function setSize(w, h) {
    resolution.set(w, h);
    colorFBO.setSize(w, h);
    depthFBO.setSize(w, h);
    dofPass.setSize(w, h);
    combinePass.setSize(w, h);
    highlightPass.setSize(w, h);
    finalPass.setSize(w, h);
    finalColorPass.setSize(w, h);

    let tw = w; //Maf.nextPowerOfTwo(w) / 2;
    let th = h; //Maf.nextPowerOfTwo(h) / 2;
    blurPasses.forEach((pass, i) => {
      pass.shader.uniforms.resolution.value.set(tw, th);
      tw /= 2;
      th /= 2;
      pass.setSize(tw, th);
    });

  }

  return {
    render,
    setSize
  }
}

export { Post }
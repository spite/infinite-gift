import { blur5 } from './fast-separable-gaussian-blur.js';

const fs = `
precision highp float;

uniform sampler2D inputTexture;
uniform sampler2D depthTexture;

uniform vec2 resolution;
uniform vec2 direction;

varying vec2 vUv;

${blur5}

void main() {
  float depth = texture2D(depthTexture, vUv).r;
  float r = 4. * clamp(smoothstep(.25,.75,clamp(depth-.5,0.,1.)), 0., 1.);
  if(r>1.) {
    gl_FragColor = blur5(inputTexture, vUv, resolution, r * direction);
  } else {
    gl_FragColor = texture2D(inputTexture, vUv);
  }
}`;

export { fs };
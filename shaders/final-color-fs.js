import fxaa from './fxaa.js';
import grayscale from './grayscale.js';
import overlay from './overlay.js';
import random from './random.js';

const fs = `
precision highp float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D inputTexture;

varying vec2 vUv;
${fxaa}
${grayscale}
${overlay}
${random}

void main() {
  vec4 color = fxaa(inputTexture, vUv);
  color = overlay(color,vec4(random(vec3(vUv,0.),time)),.1);
  gl_FragColor = color;//vec4(grayscale(color));
}
`;

export { fs };
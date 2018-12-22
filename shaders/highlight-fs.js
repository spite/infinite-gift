import grayscale from './grayscale.js';

const fs = `
precision highp float;

uniform sampler2D inputTexture;

varying vec2 vUv;

${grayscale}

void main() {
  vec4 color = texture2D(inputTexture, vUv);
  //float g = grayscale(color);
  gl_FragColor = vec4(smoothstep(.7, 1., grayscale(color)));
}
`;

export { fs };
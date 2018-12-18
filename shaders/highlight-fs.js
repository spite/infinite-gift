import grayscale from '../../shaders/grayscale.js';

const fs = `
precision highp float;

uniform sampler2D inputTexture;

varying vec2 vUv;

${grayscale}

void main() {
  vec4 color = texture2D(inputTexture, vUv);
  float g = grayscale(color);
  gl_FragColor = color * 2.*clamp(g*.15,0.,1.);
}
`;

export { fs };
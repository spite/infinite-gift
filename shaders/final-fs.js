import vignette from '../../shaders/vignette.js';
import softLight from '../../shaders/soft-light.js';
import screen from '../../shaders/screen.js';
import { gammaCorrect, levelRange, finalLevels } from '../../shaders/levels.js';
import fxaa from '../../shaders/fxaa.js';
import rgbShift from '../../shaders/rgb-shift.js';

const fs = `
precision highp float;

uniform vec2 resolution;

uniform sampler2D inputTexture;
uniform float vignetteBoost;
uniform float vignetteReduction;

varying vec2 vUv;
${vignette}
${softLight}
${screen}
${gammaCorrect}
${levelRange}
${finalLevels}
${rgbShift}

void main() {
  vec4 color = rgbShift(inputTexture, vUv, resolution/80.);
  vec4 v = vec4(vec3(vignette(vUv, vignetteBoost, vignetteReduction)),1.);
  vec4 finalColor = softLight(color, v);
  finalColor.rgb = finalLevels(finalColor.rgb, vec3(20.) / 255., vec3(1.), vec3(235.)/ 255.);
  gl_FragColor = finalColor;
}
`;

export { fs };
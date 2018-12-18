const vs = `
precision highp float;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

varying float vDepth;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  float l = length(cameraPosition);
  vDepth = abs(-mvPosition.z-l) / abs(l);
  vDepth = .1+ .9*vDepth;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export { vs };
const fs = `
precision highp float;

varying float vDepth;

void main() {
  gl_FragColor = vec4(vDepth);
}
`;

export { fs };
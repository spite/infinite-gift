import { Scene, PerspectiveCamera, WebGLRenderer } from '../third_party/three.module.js';
import OrbitControls from '../third_party/THREE.OrbitControls.js';

import { GiftBox } from './gift-box.js';
import { Maf } from './maf.js';

import { Paper } from './paper1.js';

const p = new Paper(512, 512);

const renderer = new WebGLRenderer({});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.vr.enabled = true;

//document.body.appendChild( WEBVR.createButton( renderer ) );

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, .1, 20);
camera.position.set(4, 2, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

function animate() {
  renderer.setAnimationLoop(render);
}

function setSize(w, h) {
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function render() {
  renderer.render(scene, camera);
}

for (let j = 0; j < 10; j++) {
  const box = new GiftBox();
  box.position.set(Maf.randomInRange(-10, 10), Maf.randomInRange(-10, 10), Maf.randomInRange(-10, 10));
  scene.add(box);
}

export { renderer, setSize, render, animate }
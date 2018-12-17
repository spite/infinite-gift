import {
  PCFSoftShadowMap,
  SpotLight,
  Scene,
  Group,
  Vector3,
  Matrix4,
  Object3D,
  Quaternion,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  CanvasTexture,
  Mesh,
  BoxBufferGeometry,
  TextureLoader,
  MeshBasicMaterial,
  FogExp2,
  AmbientLight,
  RepeatWrapping,
  Color,
} from '../third_party/three.module.js';
import OrbitControls from '../third_party/THREE.OrbitControls.js';
import { EquirectangularToCubemap } from '../third_party/equirectangular-to-cubemap.js';
import { UpdatableTexture } from '../third_party/UpdatableTexture.js';
import { WEBVR } from '../third_party/WebVR.js';

import { GiftBox } from './gift-box.js';
import { Maf } from './maf.js';
import easings from './easings.js';

import { Paper as Paper1 } from './paper1.js';
import { Paper as Paper2 } from './paper2.js';
import { Paper as Paper3 } from './paper3.js';
import { Paper as Paper4 } from './paper4.js';
import { Paper as Paper5 } from './paper5.js';
import { Paper as Paper6 } from './paper6.js';
import { Paper as Paper7 } from './paper7.js';
import { Paper as Paper8 } from './paper8.js';
import { Paper as Paper9 } from './paper9.js';

const papers = [
  Paper1,
  //Paper2,
  Paper3,
  Paper4,
  //Paper5,
  Paper6,
  Paper7,
  Paper8,
  Paper9
];

const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.vr.enabled = true;
renderer.setClearColor(0x202020, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

document.body.appendChild(WEBVR.createButton(renderer));

const factor = 3;

const scene = new Scene();
scene.fog = new FogExp2(0, .02);
const camera = new PerspectiveCamera(60, 1, .01, 20 * factor);
camera.position.set(0, 0, 1.6 * factor);
camera.lookAt(scene.position);

const ambient = new AmbientLight(0x404040);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

const cameraLight = new SpotLight(0xffffff, 1, 20 * factor, Math.PI / 4, .5, .1);
cameraLight.castShadow = true;
cameraLight.shadow.camera.near = .1 * factor;
cameraLight.shadow.camera.far = 20 * factor;
cameraLight.shadow.camera.fov = 30;
cameraLight.shadow.bias = -.005;
scene.add(cameraLight);

let startTime = 0;

function animate() {
  startTime = performance.now();
  renderer.setAnimationLoop(render);
}

function setSize(w, h) {
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const duration = .5 * 2 * 7.385;
let envMap;
let normalMap;

function loadAssets() {
  const texLoader = new TextureLoader();
  return Promise.all([
    new Promise((resolve, reject) => {
      normalMap = texLoader.load('../assets/normal.jpg', (res) => resolve());
      normalMap.wrapS = normalMap.wrapT = RepeatWrapping;
    }),
    new Promise((resolve, reject) => {
      texLoader.load('../assets/env.jpg', (res) => {
        const equiToCube = new EquirectangularToCubemap(renderer);
        envMap = equiToCube.convert(res, 1024);
        envMap.needsUpdate = true;
        resolve();
      });
    })
  ]);
}

async function init() {
  await loadAssets();
  initScene();
  updateBox(0, 0);
  updateWrappingPaper(0);
}

const target = new Vector3();
const m = new Matrix4();
const q = new Quaternion();
const group = new Group();
const boxes = [];
const queue = [];
const tileSize = 128;

const updateCanvas = document.createElement('canvas');
updateCanvas.width = updateCanvas.height = tileSize;
const updateCtx = updateCanvas.getContext('2d');

let depth = 0;
let prevTargetBox = null;

function initScene() {
  for (let j = 0; j < 3; j++) {
    const box = new GiftBox();
    box.scale.setScalar(1 / Math.exp(factor * j));
    target.set(Maf.randomInRange(-1, 1), Maf.randomInRange(-1, 1), Maf.randomInRange(-1, 1)).normalize();
    m.lookAt(box.position, target, Object3D.DefaultUp);
    q.setFromRotationMatrix(m);
    box.quaternion.copy(q);
    q.setFromRotationMatrix(m.getInverse(m));
    group.add(box);
    boxes.push({
      mesh: box,
      quaternion: q.clone()
    });
    box.material.map = new UpdatableTexture();
    box.material.map.setRenderer(renderer);
    box.material.map.wrapS = box.material.map.wrapT = RepeatWrapping;
    box.material.metalnessMap = new UpdatableTexture();
    box.material.metalnessMap.setRenderer(renderer);
    box.material.metalnessMap.wrapS = box.material.metalnessMap.wrapT = RepeatWrapping;
    box.material.color = new Color(0xffffff);
    box.material.roughnes = .5;
    box.material.metalness = 1;
  }
  scene.add(group);
  renderer.render(scene, camera);
  boxes.forEach((b) => {
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = emptyCanvas.height = 512;
    b.mesh.material.map.setSize(512, 512);
    b.mesh.material.map.update(emptyCanvas, 0, 0);
    b.mesh.material.metalnessMap.setSize(512, 512);
    b.mesh.material.metalnessMap.update(emptyCanvas, 0, 0);
  });
}

function updateBox(ptr, count) {
  const box = boxes[ptr];
  box.mesh.scale.setScalar(1 / Math.exp(factor * count));
  target.set(Maf.randomInRange(-1, 1), Maf.randomInRange(-1, 1), Maf.randomInRange(-1, 1)).normalize();
  m.lookAt(box.mesh.position, target, Object3D.DefaultUp);
  q.setFromRotationMatrix(m);
  box.mesh.quaternion.copy(q);
  q.setFromRotationMatrix(m.getInverse(m));
  box.quaternion.copy(q);
}

function updateWrappingPaper(ptr) {
  const box = boxes[ptr];
  const Paper = papers[~~Maf.randomInRange(0, papers.length)];
  const p = new Paper(512, 512);
  for (let y = 0; y < p.colorCanvas.height; y += tileSize) {
    for (let x = 0; x < p.colorCanvas.width; x += tileSize) {
      queue.push({
        target: box.mesh.material.map,
        source: p.colorCanvas,
        x,
        y,
        width: tileSize,
        height: tileSize
      })
    }
  }
  for (let y = 0; y < p.colorCanvas.height; y += tileSize) {
    for (let x = 0; x < p.colorCanvas.width; x += tileSize) {
      queue.push({
        target: box.mesh.material.metalnessMap,
        source: p.roughnessCanvas,
        x,
        y,
        width: tileSize,
        height: tileSize
      })
    }
  }
  box.mesh.material.map.wrapS = box.mesh.material.map.wrapT = RepeatWrapping;
  box.mesh.material.metalnessMap.wrapS = box.mesh.material.metalnessMap.wrapT = RepeatWrapping;

  box.mesh.material.normalMap = normalMap;
  box.mesh.material.normalMap.wrapS = box.mesh.material.normalMap.wrapT = RepeatWrapping;
  box.mesh.material.normalScale.set(.1, .1);
  box.mesh.material.envMap = envMap;
  box.mesh.material.envMapIntensity = 1.;
  box.mesh.material.needsUpdate = true;
}

/*requestIdleCallback(processQueue);

function processQueue(deadline) {
  while (deadline.timeRemaining()) {
    const task = queue.shift();
    if (task) {
      updateCtx.drawImage(task.source, task.x, task.y, tileSize, tileSize, 0, 0, tileSize, tileSize);
      task.target.update(updateCanvas, task.x, task.y);
    }
  }
  requestIdleCallback(processQueue);
}*/

function render() {
  const delta = (performance.now() - startTime) / (duration * 1000);
  const targetBox = Math.max((~~delta), 0) % boxes.length;
  const prevBox = Maf.mod(targetBox - 1, boxes.length);
  const nextBox = Maf.mod(targetBox + 1, boxes.length);
  if (targetBox !== prevTargetBox) {
    depth++;
    updateBox(nextBox, depth);
    updateWrappingPaper(Maf.mod(nextBox, boxes.length));
    prevTargetBox = targetBox;
  }

  const qTo = boxes[targetBox].quaternion;
  const qFrom = boxes[prevBox].quaternion;
  boxes.forEach((b) => {
    b.mesh.material.color.setRGB(1, 1, 1);
    b.mesh.visible = false;
  });
  boxes[targetBox].mesh.visible = true;
  boxes[prevBox].mesh.visible = true;
  boxes[nextBox].mesh.visible = true;
  boxes[prevBox].mesh.pivot.rotation.y = Maf.PI;
  boxes[targetBox].mesh.pivot.rotation.y = (delta % 1) * (Maf.PI);
  boxes[nextBox].mesh.pivot.rotation.y = 0;
  //boxes.forEach((b) => b.mesh.material.color.setRGB(1, 1, 1));
  //boxes[targetBox].mesh.material.color.setRGB(1, 0, 0);
  group.quaternion.copy(qFrom).slerp(qTo, easings.InOutQuint(delta % 1));
  group.scale.setScalar(Math.exp(factor * delta));
  //camera.lookAt(group.position);
  camera.rotation.z = .5 * delta * Maf.TAU;
  cameraLight.position.copy(camera.position);
  cameraLight.position.y += .5;
  renderer.render(scene, camera);

  for (let j = 0; j < 1; j++) {
    const task = queue.shift();
    if (task) {
      updateCtx.drawImage(task.source, task.x, task.y, tileSize, tileSize, 0, 0, tileSize, tileSize);
      task.target.update(updateCanvas, task.x, task.y);
    }
  }

}

export { renderer, setSize, render, animate, init }
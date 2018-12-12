import {
  PCFSoftShadowMap,
  DirectionalLight,
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
  MeshBasicMaterial,
  FogExp2,
  AmbientLight
} from '../third_party/three.module.js';
import OrbitControls from '../third_party/THREE.OrbitControls.js';

import { GiftBox } from './gift-box.js';
import { Maf } from './maf.js';
import easings from './easings.js';

import { Paper } from './paper1.js';

const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.vr.enabled = true;
renderer.setClearColor(0x202020, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

//document.body.appendChild( WEBVR.createButton( renderer ) );

const factor = 3;

const scene = new Scene();
scene.fog = new FogExp2(0, .02);
const camera = new PerspectiveCamera(75, 1, .01, 20 * factor);
camera.position.set(0, 0, 1.6 * factor);
camera.lookAt(scene.position);

const ambient = new AmbientLight(0x404040);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

const light = new DirectionalLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
light.castShadow = true;
const s = 1;
light.shadow.mapSize.width = light.shadow.mapSize.height = 32;
light.shadow.left = -s;
light.shadow.bottom = -s;
light.shadow.right = s;
light.shadow.top = s;
light.shadow.camera.near = .1;
light.shadow.camera.far = 30;
light.shadow.camera.updateProjectionMatrix();
//scene.add(light);

const cameraLight = new PointLight(0xffffff, 1, 100);
cameraLight.castShadow = true;
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

function render() {
  const delta = (performance.now() - startTime) / (duration * 1000);
  const targetBox = Math.max((~~delta), 0);
  const qTo = boxes[targetBox].quaternion;
  const qFrom = boxes[Math.max(targetBox - 1, 0)].quaternion;
  boxes.forEach((b) => {
    b.mesh.material.color.setRGB(1, 1, 1);
    b.mesh.visible = false;
  });
  boxes[targetBox].mesh.visible = true;
  boxes[Math.max(targetBox - 1, 0)].mesh.visible = true;
  boxes[Math.min(targetBox + 1, boxes.length - 1)].mesh.visible = true;
  //boxes[targetBox].mesh.material.color.setRGB(1, 0, 0);
  group.quaternion.copy(qFrom).slerp(qTo, easings.InOutQuad(delta % 1));
  group.scale.setScalar(Math.exp(factor * delta));
  //camera.lookAt(group.position);
  camera.rotation.z = .5 * delta * Maf.TAU;
  cameraLight.position.copy(camera.position);
  cameraLight.position.y += .5;
  renderer.render(scene, camera);
}

const p = new Paper(512, 512);

const target = new Vector3();
const m = new Matrix4();
const q = new Quaternion();
const group = new Group();
const boxes = [];
for (let j = 0; j < 200; j++) {
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
  box.material.map = new CanvasTexture(p.colorCanvas);
  box.material.roughnessMap = new CanvasTexture(p.roughnessCanvas);
}
scene.add(group);

export { renderer, setSize, render, animate }
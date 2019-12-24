import {
  PCFShadowMap,
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
  PlaneBufferGeometry,
  MeshNormalMaterial,
  Color
} from "../third_party/three.module.js";
import OrbitControls from "../third_party/THREE.OrbitControls.js";
import { EquirectangularToCubemap } from "../third_party/equirectangular-to-cubemap.js";
import { UpdatableTexture } from "../third_party/UpdatableTexture.js";

import { GiftBox } from "./gift-box.js";
import { Maf } from "./maf.js";
import easings from "./easings.js";
import { Post } from "./post.js";

import { Paper as Paper1 } from "./paper1.js";
import { Paper as Paper2 } from "./paper2.js";
import { Paper as Paper3 } from "./paper3.js";
import { Paper as Paper4 } from "./paper4.js";
import { Paper as Paper5 } from "./paper5.js";
import { Paper as Paper6 } from "./paper6.js";
import { Paper as Paper7 } from "./paper7.js";
import { Paper as Paper8 } from "./paper8.js";
import { Paper as Paper9 } from "./paper9.js";
import { Paper as Paper10 } from "./paper10.js";
import { Paper as Paper11 } from "./paper11.js";
import { Paper as Paper12 } from "./paper12.js";
import { Paper as Paper13 } from "./paper13.js";
import { Paper as Paper14 } from "./paper14.js";
import { Paper as Paper15 } from "./paper15.js";
import { Paper as Paper16 } from "./paper16.js";
import { Paper as Paper17 } from "./paper17.js";
import { Paper as Paper18 } from "./paper18.js";
import { Paper as Paper19 } from "./paper19.js";
import { Paper as Paper20 } from "./paper20.js";

const configs = {
  low: {
    textureSize: 256,
    tileSize: 32,
    pixelRatio: 0.5,
    shadow: PCFShadowMap,
    material: "phong",
    post: false
  },
  std: {
    textureSize: 512,
    tileSize: 64,
    pixelRatio: 0.5,
    shadow: PCFSoftShadowMap,
    material: "pbr",
    post: true
  },
  high: {
    textureSize: 512,
    tileSize: 64,
    pixelRatio: 1,
    shadow: PCFSoftShadowMap,
    material: "pbr",
    post: true
  },
  vrlow: {
    textureSize: 512,
    tileSize: 32,
    pixelRatio: 1,
    shadow: PCFShadowMap,
    material: "phong",
    post: false
  },
  vrhigh: {
    textureSize: 512,
    tileSize: 32,
    pixelRatio: 1,
    shadow: PCFShadowMap,
    material: "phong",
    post: false
  }
};

let config;

const papers = [
  Paper1,
  Paper2,
  Paper3,
  Paper4,
  Paper5,
  Paper6,
  Paper7,
  Paper8,
  Paper9,
  Paper10,
  Paper11,
  Paper12,
  Paper13,
  Paper14,
  Paper15,
  Paper16,
  Paper17,
  Paper18,
  Paper19,
  Paper20
];

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;

const post = new Post(renderer);

const factor = 2;

const scene = new Scene();
scene.fog = new FogExp2(0xffffff, 0.01);
const camera = new PerspectiveCamera(60, 1, 0.01, 30 * factor);
//camera.lookAt(scene.position);
const cameraDummy = new Group();
cameraDummy.position.set(0, 0, 1.5 * factor);
cameraDummy.add(camera);
scene.add(cameraDummy);
/*camera.position.set(0, 0, 1.6 * factor);
scene.add(camera);*/

const ambient = new AmbientLight(0x808080);
scene.add(ambient);

//const controls = new OrbitControls(camera, renderer.domElement);
//controls.screenSpacePanning = true;

const cameraLight = new SpotLight(
  0xffffff,
  0.5,
  20 * factor,
  Math.PI / 3,
  0.5,
  0.1
);
cameraLight.castShadow = true;
cameraLight.shadow.mapSize.width = 512;
cameraLight.shadow.mapSize.height = 512;
cameraLight.shadow.camera.near = 0.01 * factor;
cameraLight.shadow.camera.far = 1.5 * factor;
//cameraLight.shadow.bias = -.005;
scene.add(cameraLight);

let startTime;

function animate() {
  renderer.domElement.className = "visible render";
  audio.loop = true;
  audio.playbackRate = 1;
  audio.play();
  startTime = performance.now();
  renderer.setAnimationLoop(render);
}

function setSize(w, h) {
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  const dPR = renderer.getPixelRatio();
  post.setSize(w * dPR, h * dPR);
}

const duration = 0.5 * 2 * 7.385;
let envMap;
let normalMap;
let audio;

function loadAssets() {
  const texLoader = new TextureLoader();
  return Promise.all([
    new Promise((resolve, reject) => {
      audio = document.createElement("audio");
      audio.addEventListener("canplay", e => {
        resolve();
      });
      if (audio.canPlayType('video/ogg; codecs="theora"')) {
        audio.src = "./assets/track.ogg";
      } else {
        audio.src = "./assets/track.mp3";
      }
    }),
    new Promise((resolve, reject) => {
      normalMap = texLoader.load("./assets/normal.jpg", res => resolve());
      normalMap.wrapS = normalMap.wrapT = RepeatWrapping;
    }),
    new Promise((resolve, reject) => {
      texLoader.load("./assets/env.jpg", res => {
        const equiToCube = new EquirectangularToCubemap(renderer);
        envMap = equiToCube.convert(res, 512);
        envMap.needsUpdate = true;
        resolve();
      });
    })
  ]);
}

const updateCanvas = document.createElement("canvas");
const updateCtx = updateCanvas.getContext("2d");

async function init(preset) {
  config = configs[preset];

  renderer.setPixelRatio(window.devicePixelRatio * config.pixelRatio);
  renderer.shadowMap.type = config.shadow;

  paperSize = config.textureSize;
  tileSize = config.tileSize;
  updateCanvas.width = updateCanvas.height = tileSize;

  initScene();
  updateBox(0, 0);
  updateWrappingPaper(0);
}

const target = new Vector3();
const m = new Matrix4();
const q = new Quaternion();
const group = new Group();
const boxes = [];
const cards = [];
const queue = [];
let paperSize;
let tileSize;

let depth = 0;
let prevTargetBox = null;

function initScene() {
  for (let j = 0; j < 3; j++) {
    const card = new Mesh(
      new PlaneBufferGeometry(0.1, 0.2),
      new MeshNormalMaterial()
    );
    //group.add(card);
    cards.push({
      mesh: card,
      quaternion: new Quaternion()
    });
    const box = new GiftBox(config.material);
    box.orientateLid();
    box.scale.setScalar(1 / Math.exp(factor * j));
    target
      .set(
        Maf.randomInRange(-1, 1),
        Maf.randomInRange(-1, 1),
        Maf.randomInRange(-1, 1)
      )
      .normalize();
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
    box.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    box.material.map.setRenderer(renderer);
    box.material.map.wrapS = box.material.map.wrapT = RepeatWrapping;
    if (config.material === "phong") {
      box.material.specularMap = new UpdatableTexture();
      box.material.specularMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
      box.material.specularMap.setRenderer(renderer);
      box.material.specularMap.wrapS = box.material.specularMap.wrapT = RepeatWrapping;
    } else {
      box.material.roughnessMap = new UpdatableTexture();
      box.material.map.roughnessMap = renderer.capabilities.getMaxAnisotropy();
      box.material.roughnessMap.setRenderer(renderer);
      box.material.roughnessMap.wrapS = box.material.roughnessMap.wrapT = RepeatWrapping;
      box.material.metalnessMap = box.material.map;
    }
    box.material.normalMap = normalMap;
    box.material.normalMap.wrapS = box.material.normalMap.wrapT = RepeatWrapping;
    box.material.normalScale.set(0.05, 0.05);
    box.material.envMap = envMap;
    box.material.envMapIntensity = 0.8;
    box.material.needsUpdate = true;
  }
  scene.add(group);
  renderer.render(scene, camera);
  boxes.forEach(b => {
    const emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = emptyCanvas.height = paperSize;
    b.mesh.material.map.setSize(paperSize, paperSize);
    b.mesh.material.map.update(emptyCanvas, 0, 0);
    if (config.material === "phong") {
      b.mesh.material.specularMap.setSize(paperSize, paperSize);
      b.mesh.material.specularMap.update(emptyCanvas, 0, 0);
    } else {
      b.mesh.material.roughnessMap.setSize(paperSize, paperSize);
      b.mesh.material.roughnessMap.update(emptyCanvas, 0, 0);
    }
  });
}

function updateBox(ptr, count) {
  const box = boxes[ptr];
  box.mesh.refresh();
  box.mesh.scale.setScalar(1 / Math.exp(factor * count));
  target
    .set(
      Maf.randomInRange(-1, 1),
      Maf.randomInRange(-1, 1),
      Maf.randomInRange(-1, 1)
    )
    .normalize();
  m.lookAt(box.mesh.position, target, Object3D.DefaultUp);
  q.setFromRotationMatrix(m);
  box.mesh.quaternion.copy(q);
  q.setFromRotationMatrix(m.getInverse(m));
  box.quaternion.copy(q);
  const card = cards[ptr];
  card.mesh.scale.setScalar(1 / Math.exp(factor * count));
  card.mesh.quaternion.copy(box.mesh.quaternion);
}

let sequence = [1];
let paperCounter = 0;

function buildSequence() {
  const lastOne = sequence[sequence.length - 1];
  sequence = [];
  for (let j = 0; j < papers.length; j++) {
    sequence.push(j);
  }
  do {
    sequence.sort((a, b) => Maf.randomInRange(-1, 1));
  } while (lastOne === sequence[0]);
}
buildSequence();

function updateWrappingPaper(ptr) {
  const box = boxes[ptr];
  const Paper = papers[sequence[paperCounter]];
  const p = new Paper(paperSize, paperSize);
  paperCounter++;
  if (paperCounter > sequence.length - 1) {
    buildSequence();
    paperCounter = 0;
  }
  for (let y = 0; y < p.colorCanvas.height; y += tileSize) {
    for (let x = 0; x < p.colorCanvas.width; x += tileSize) {
      queue.push({
        target: box.mesh.material.map,
        source: p.colorCanvas,
        x,
        y,
        width: tileSize,
        height: tileSize
      });
    }
  }
  for (let y = 0; y < p.roughnessCanvas.height; y += tileSize) {
    for (let x = 0; x < p.roughnessCanvas.width; x += tileSize) {
      queue.push({
        target:
          config.material === "phong"
            ? box.mesh.material.specularMap
            : box.mesh.material.roughnessMap,
        source: p.roughnessCanvas,
        x,
        y,
        width: tileSize,
        height: tileSize
      });
    }
  }
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
  const delta = Math.max(
    (1 * (performance.now() - startTime)) / (duration * 1000),
    0
  );
  const targetBox = Math.max(~~delta, 0) % boxes.length;
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

  boxes[prevBox].mesh.pivot.rotation.y =
    Maf.PI - Maf.clamp(3 * (delta % 1) * Maf.PI, 0, Maf.PI);
  boxes[targetBox].mesh.pivot.rotation.y = (delta % 1) * Maf.PI;
  boxes[nextBox].mesh.pivot.rotation.y = 0;
  group.quaternion.copy(qFrom).slerp(qTo, easings.InOutQuad(delta % 1));
  group.scale.setScalar(Math.exp(factor * delta));
  target.copy(scene.position);
  const t = 0.0001 * performance.now();
  target.x += 0.5 * Math.cos(t);
  target.y += 0.5 * Math.sin(t);
  camera.lookAt(target);
  camera.rotation.z = 0.5 * delta * Maf.TAU;
  cameraLight.position.copy(cameraDummy.position);
  cameraLight.position.y += 0.5;
  cameraLight.position.z -= 1;

  if (renderer.xr.enabled || config.post === false) {
    renderer.render(scene, camera);
  } else {
    post.render(scene, camera, boxes);
  }

  for (let j = 0; j < 8; j++) {
    const task = queue.shift();
    if (task) {
      updateCtx.drawImage(
        task.source,
        task.x,
        task.y,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
      );
      task.target.update(updateCanvas, task.x, task.y);
    }
  }
}

export { renderer, setSize, render, animate, init, loadAssets };

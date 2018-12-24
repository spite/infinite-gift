import { renderer, setSize, animate, render, init, loadAssets } from './modules/scene.js';
import { detectWebXR, startWebXR } from '../third_party/WebXR.js';

const padding = 80;
const presets = document.getElementById('presets');
const options = document.getElementById('options');
const loading = document.getElementById('loading');

if (!Element.prototype.requestFullscreen) {
  Element.prototype.requestFullscreen = Element.prototype.mozRequestFullScreen || Element.prototype.webkitRequestFullScreen;
}

async function start() {
  document.body.appendChild(renderer.domElement);
  renderer.domElement.className = 'hidden render';
  renderer.domElement.id = 'canvas';
  resize();

  const WebXRDevice = await detectWebXR(renderer);
  if (WebXRDevice) {
    document.getElementById('webxr').style.display = 'block';
  }
  await loadAssets();
  loading.style.display = 'none';
  presets.style.display = 'block';
  const options = presets.querySelectorAll('a');
  for (let option of options) {
    option.addEventListener('click', (e) => {
      run(option.id, (option.id === 'vrlow' || option.id === 'vrhigh') ? WebXRDevice : null);
    });
  }
}

async function run(preset, device) {
  if (device) {
    renderer.vr.enabled = true;
  }
  await init(preset);
  options.className = 'hidden';
  if (device) {
    startWebXR(device, renderer);
  }
  await renderer.domElement.requestFullscreen();
  animate();
}

try {
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      resize();
    }
  });
  resizeObserver.observe(document.body);
} catch (e) {
  window.addEventListener('resize', (e) => resize);
}

function resize() {
  let w = document.body.clientWidth;
  let h = document.body.clientHeight;
  h -= 2 * padding;
  setSize(w, h);
}

window.addEventListener('load', start);
import { renderer, setSize, animate, render, init } from './modules/scene.js';

const startBtn = document.getElementById('start');
const loading = document.getElementById('loading');

if (!Element.prototype.requestFullscreen) {
  Element.prototype.requestFullscreen = Element.prototype.mozRequestFullScreen || Element.prototype.webkitRequestFullScreen;
}

async function run() {
  await init();
  //animate();
  loading.style.display = 'none';
  startBtn.style.display = 'block';
  startBtn.addEventListener('click', async (e) => {
    startBtn.style.display = 'none';
    await renderer.domElement.requestFullscreen();
    setTimeout(animate, 500);
  })
}

run();

document.body.appendChild(renderer.domElement);
renderer.domElement.className = 'render';

try {
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      setSize(document.body.clientWidth, document.body.clientHeight);
    }
  });
  resizeObserver.observe(document.body);
} catch (e) {
  window.addEventListener('resize', (e) => setSize(document.body.clientWidth, document.body.clientHeight));
}

setSize(document.body.clientWidth, document.body.clientHeight);
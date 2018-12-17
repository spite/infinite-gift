import { renderer, setSize, animate, render, init } from './modules/scene.js';

const startBtn = document.getElementById('start');
const loading = document.getElementById('loading');

async function run() {
  await init();
  //animate();
  loading.style.display = 'none';
  startBtn.style.display = 'block';
  startBtn.addEventListener('click', (e) => {
    startBtn.style.display = 'none';
    animate();
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
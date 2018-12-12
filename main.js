import { renderer, setSize, animate, render } from './modules/scene.js';

document.body.appendChild(renderer.domElement);
renderer.domElement.className = 'render';

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    setSize(document.body.clientWidth, document.body.clientHeight);
  }
});
resizeObserver.observe(document.body);

animate();
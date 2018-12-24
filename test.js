import { Paper } from './modules/paper13.js';

const paper = new Paper(512, 512);
document.body.appendChild(paper.colorCanvas);
document.body.appendChild(paper.roughnessCanvas);
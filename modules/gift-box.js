import { Mesh, BoxBufferGeometry, MeshNormalMaterial } from '../third_party/three.module.js';
import { Maf } from './maf.js';

const material = new MeshNormalMaterial();

class GiftBox extends Mesh {

  constructor() {
    const w = Maf.randomInRange(1, 2);
    const h = Maf.randomInRange(1, 2);
    const d = Maf.randomInRange(1, 2);
    const geometry = new BoxBufferGeometry(w, h, d);
    super(geometry, material);
  }
}

export { GiftBox }
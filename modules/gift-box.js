import { Mesh, Group, DoubleSide, PlaneGeometry, BufferAttribute, BufferGeometry, Geometry, MeshNormalMaterial, MeshBasicMaterial, MeshPhysicalMaterial, Vector3, Vector2, Face3, Matrix4 } from '../third_party/three.module.js';
import { Maf } from './maf.js';

function merge() {
  const total = [...arguments].reduce((accumulator, geometry) => accumulator + geometry.attributes.position.count, 0);
  const res = new BufferGeometry();
  res.addAttribute('position', new BufferAttribute(new Float32Array(total * 3), 3));
  res.addAttribute('normal', new BufferAttribute(new Float32Array(total * 3), 3));
  res.addAttribute('uv', new BufferAttribute(new Float32Array(total * 2), 2));
  let ptr = 0;
  [...arguments].forEach((geometry, id) => {
    res.merge(geometry, ptr);
    ptr += geometry.attributes.position.count;
  })
  return res;
}

function quad(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  const geometry = new BufferGeometry().fromGeometry(new PlaneGeometry(1, 1));
  const pos = geometry.attributes.position.array;
  pos[0] = x0;
  pos[1] = y0;
  pos[2] = z0;
  pos[3] = pos[9] = x1;
  pos[4] = pos[10] = y1;
  pos[5] = pos[11] = z1;
  pos[6] = pos[15] = x3;
  pos[7] = pos[16] = y3;
  pos[8] = pos[17] = z3;
  pos[12] = x2;
  pos[13] = y2;
  pos[14] = z2;
  geometry.computeVertexNormals();
  const uvs = geometry.attributes.uv.array;
  const wx = Math.max(x0, x1, x2, x3) - Math.min(x0, x1, x2, x3);
  const wy = Math.max(y0, y1, y2, y3) - Math.min(y0, y1, y2, y3);
  const wz = Math.max(z0, z1, z2, z3) - Math.min(z0, z1, z2, z3);
  let w;
  let h;
  if (wx === 0) {
    w = wz;
    h = wy;
  }
  if (wy === 0) {
    w = wx;
    h = wz;
  }
  if (wz === 0) {
    w = wx;
    h = wy;
  }
  for (let i = 0; i < uvs.length; i += 2) {
    uvs[i] /= w;
    uvs[i + 1] /= h;
  }
  return geometry;
}

class GiftBox extends Group {

  constructor() {
    super();

    this.material = new MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: .8,
      metalness: 0
    });

    const w = Maf.randomInRange(.75, 1);
    const h = Maf.randomInRange(.75, 1);
    const d = Maf.randomInRange(.75, 1);
    const p = .01;

    const boxGeometry = this.getGeometry(w, h, d, p);
    boxGeometry.applyMatrix(new Matrix4().makeRotationX(Maf.PI / 2));
    this.box = new Mesh(boxGeometry, this.material);
    this.box.castShadow = true;
    this.box.receiveShadow = true;
    this.add(this.box);

    this.pivot = new Group();
    this.pivot.position.x = 1;
    const lidGeometry = this.getGeometry(w + 2 * p, .25 * h, d + 2 * p, p);
    lidGeometry.applyMatrix(new Matrix4().makeRotationX(-Maf.PI / 2));
    lidGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, .5 * h));
    this.lid = new Mesh(lidGeometry, this.material);
    this.lid.castShadow = true;
    this.lid.receiveShadow = true;
    this.lid.position.x = -1;
    this.pivot.add(this.lid);
    this.pivot.rotation.y = Maf.PI / 4;
    this.add(this.pivot);
  }

  getGeometry(w, h, d, p) {
    const hw = .5 * w;
    const hh = .5 * h;
    const hd = .5 * d;

    const geometry = merge(
      quad(-hw, -hh, -hd, hw, -hh, -hd, hw, -hh, hd, -hw, -hh, hd),

      quad(-hw, -hh, -hd, -hw, -hh, hd, -hw, hh, hd, -hw, hh, -hd),
      quad(hw, -hh, hd, hw, -hh, -hd, hw, hh, -hd, hw, hh, hd),
      quad(hw, -hh, -hd, -hw, -hh, -hd, -hw, hh, -hd, hw, hh, -hd),
      quad(-hw, -hh, hd, hw, -hh, hd, hw, hh, hd, -hw, hh, hd),

      quad((hw - p), -(hh - p), -(hd - p), -(hw - p), -(hh - p), -(hd - p), -(hw - p), -(hh - p), (hd - p), (hw - p), -(hh - p), (hd - p)),
      quad(-(hw - p), -(hh - p), (hd - p), -(hw - p), -(hh - p), -(hd - p), -(hw - p), hh, -(hd - p), -(hw - p), hh, (hd - p)),
      quad((hw - p), -(hh - p), -(hd - p), (hw - p), -(hh - p), (hd - p), (hw - p), hh, (hd - p), (hw - p), hh, -(hd - p)),
      quad((hw - p), -(hh - p), (hd - p), -(hw - p), -(hh - p), (hd - p), -(hw - p), hh, (hd - p), (hw - p), hh, (hd - p)),
      quad(-(hw - p), -(hh - p), -(hd - p), (hw - p), -(hh - p), -(hd - p), (hw - p), hh, -(hd - p), -(hw - p), hh, -(hd - p)),

      quad(hw, hh, -hd, -hw, hh, -hd, -(hw - p), hh, -(hd - p), hw - p, hh, -(hd - p)),
      quad(-hw, hh, hd, hw, hh, hd, hw - p, hh, hd - p, -(hw - p), hh, hd - p),
      quad(-hw, hh, -hd, -hw, hh, hd, -(hw - p), hh, hd - p, -(hw - p), hh, -(hd - p)),
      quad(hw, hh, hd, hw, hh, -hd, hw - p, hh, -(hd - p), hw - p, hh, hd - p),
    );

    return geometry;
  }
}

export { GiftBox }
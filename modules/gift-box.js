import {
  Mesh,
  Group,
  DoubleSide,
  PlaneGeometry,
  BufferAttribute,
  BufferGeometry,
  MeshBasicMaterial,
  Geometry,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  Vector3,
  Vector2,
  Face3,
  Matrix4
} from '../third_party/three.module.js';
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

function quad(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, u0, v0, u1, v1, u2, v2, u3, v3, u, v) {
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
  const ratio = v / u;
  uvs[0] = u0;
  uvs[1] = v0 * ratio;
  uvs[2] = u1;
  uvs[3] = v1 * ratio;
  uvs[4] = u3;
  uvs[5] = v3 * ratio;
  uvs[6] = u1;
  uvs[7] = v1 * ratio;
  uvs[8] = u2;
  uvs[9] = v2 * ratio;
  uvs[10] = u3;
  uvs[11] = v3 * ratio;
  return geometry;
}

class GiftBox extends Group {

  constructor(quality) {
    super();

    this.padding = .01;

    this.colorMaterial = quality === 0 ? new MeshPhongMaterial({}) : new MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: .8,
      metalness: 0,
      emissive: 0x202020,
    });
    this.material = this.colorMaterial;

    this.maskMaterial = new MeshBasicMaterial({});

    const parts = 8;
    const w = ~~(Maf.randomInRange(.75, 1) * parts) / parts;
    const d = ~~(Maf.randomInRange(.75, 1) * parts) / parts;
    const h = ~~(Maf.randomInRange(.5, .75) * parts) / parts;
    const p = this.padding;

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
    this.pivot.rotation.y = 0;
    this.add(this.pivot);
  }

  refresh() {
    const parts = 4;
    const w = ~~(Maf.randomInRange(.75, 1) * parts) / parts;
    const d = ~~(Maf.randomInRange(.75, 1) * parts) / parts;
    const h = ~~(Maf.randomInRange(.5, .75) * parts) / parts;
    const p = this.padding;

    const boxGeometry = this.getGeometry(w, h, d, p);
    boxGeometry.applyMatrix(new Matrix4().makeRotationX(Maf.PI / 2));
    this.box.geometry = boxGeometry;
    this.box.geometry.needsUpdate = true;

    const lidGeometry = this.getGeometry(w + 2 * p, .25 * h, d + 2 * p, p);
    lidGeometry.applyMatrix(new Matrix4().makeRotationX(-Maf.PI / 2));
    lidGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, .5 * h));
    this.lid.geometry = lidGeometry;
    this.lid.geometry.needsUpdate = true;
  }

  getGeometry(w, h, d, p) {
    const hw = .5 * w;
    const hh = .5 * h;
    const hd = .5 * d;

    const geometry = merge(
      quad(-hw, -hh, -hd, hw, -hh, -hd, hw, -hh, hd, -hw, -hh, hd, 0, 0, 1, 0, 1, 1, 0, 1, d, w),

      quad(-hw, -hh, -hd, -hw, -hh, hd, -hw, hh, hd, -hw, hh, -hd, 0, 0, 1, 0, 1, 1, 0, 1, d, h),
      quad(hw, -hh, hd, hw, -hh, -hd, hw, hh, -hd, hw, hh, hd, 0, 0, 1, 0, 1, 1, 0, 1, d, h),
      quad(hw, -hh, -hd, -hw, -hh, -hd, -hw, hh, -hd, hw, hh, -hd, 0, 0, 1, 0, 1, 1, 0, 1, w, h),
      quad(-hw, -hh, hd, hw, -hh, hd, hw, hh, hd, -hw, hh, hd, 0, 0, 1, 0, 1, 1, 0, 1, w, h),

      quad((hw - p), -(hh - p), -(hd - p), -(hw - p), -(hh - p), -(hd - p), -(hw - p), -(hh - p), (hd - p), (hw - p), -(hh - p), (hd - p), 0, 0, 1, 0, 1, 1, 0, 1, w - 2 * p, d - 2 * p),

      quad(-(hw - p), -(hh - p), (hd - p), -(hw - p), -(hh - p), -(hd - p), -(hw - p), hh, -(hd - p), -(hw - p), hh, (hd - p), 0, 0, 1, 0, 1, 1, 0, 1, d - 2 * p, h - 2 * p),
      quad((hw - p), -(hh - p), -(hd - p), (hw - p), -(hh - p), (hd - p), (hw - p), hh, (hd - p), (hw - p), hh, -(hd - p), 0, 0, 1, 0, 1, 1, 0, 1, d - 2 * p, h - 2 * p),
      quad((hw - p), -(hh - p), (hd - p), -(hw - p), -(hh - p), (hd - p), -(hw - p), hh, (hd - p), (hw - p), hh, (hd - p), 0, 0, 1, 0, 1, 1, 0, 1, w - 2 * p, h - 2 * p),
      quad(-(hw - p), -(hh - p), -(hd - p), (hw - p), -(hh - p), -(hd - p), (hw - p), hh, -(hd - p), -(hw - p), hh, -(hd - p), 0, 0, 1, 0, 1, 1, 0, 1, w - 2 * p, h - 2 * p),

      quad(hw, hh, -hd, -hw, hh, -hd, -(hw - p), hh, -(hd - p), hw - p, hh, -(hd - p), 0, 0, 0, 0, 0, 0, 0, 0, w, d),
      quad(-hw, hh, hd, hw, hh, hd, hw - p, hh, hd - p, -(hw - p), hh, hd - p, 0, 0, 0, 0, 0, 0, 0, 0, w, d),
      quad(-hw, hh, -hd, -hw, hh, hd, -(hw - p), hh, hd - p, -(hw - p), hh, -(hd - p), 0, 0, 0, 0, 0, 0, 0, 0, w, d),
      quad(hw, hh, hd, hw, hh, -hd, hw - p, hh, -(hd - p), hw - p, hh, hd - p, 0, 0, 0, 0, 0, 0, 0, 0, w, d),
    );

    return geometry;
  }
}

export { GiftBox }
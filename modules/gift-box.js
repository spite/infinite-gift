import { Mesh, DoubleSide, PlaneGeometry, BufferAttribute, BufferGeometry, Geometry, MeshNormalMaterial, MeshBasicMaterial, MeshPhysicalMaterial, Vector3, Vector2, Face3, Matrix4 } from '../third_party/three.module.js';
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
  return geometry;
}

class GiftBox extends Mesh {

  constructor() {
    const w = Maf.randomInRange(.75, 1);
    const h = Maf.randomInRange(.75, 1);
    const d = Maf.randomInRange(.75, 1);
    const hw = .5 * w;
    const hh = .5 * h;
    const hd = .5 * d;
    const p = .01;

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

      //plane(-.25 * hw, hh, -.25 * hd, .25 * hw, hh, -.25 * hd, .25 * hw, hh, .25 * hd, -.25 * hw, hh, .25 * hd),
    );

    geometry.applyMatrix(new Matrix4().makeRotationX(Maf.PI / 2));
    const material = new MeshPhysicalMaterial({
      color: 0xffffff,
      depthWrite: !false,
      opacity: .5,
      transparent: !true,
      wireframe: !true,
      roughness: .8,
      metalness: 0
    }); //new MeshPhysicalMaterial();
    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}

export { GiftBox }
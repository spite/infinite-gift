import { WrappingPaper } from "./wrapping-paper.js";

function getWeightedRandom(inputs) {
  const total = inputs.reduce((ac, v) => (ac += v), 0);
  return function() {
    const r = Math.random() * total;
    let ac = 0;
    let c = 0;
    for (const v of inputs) {
      const n = ac + v;
      if (r > +ac && r < n) {
        return c;
      }
      c++;
      ac = n;
    }
  };
}

const rnd = getWeightedRandom([1, 2, 1, 8]);

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    const backgroundColor = "#ef6660";
    const specColorRim = "#ddd";
    const colorPalette1 = [
      "#ef6660",
      "#f29b9b",
      "#68cafb",
      "#bbe6fc",
      "#fef4b5",
      "#ffee5a"
    ];

    const palettes = [colorPalette1];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const specPalette = ["#eee", "#aaa", "#888", "#666", "#444"];

    this.roughnessCtx.strokeStyle = "#fff";
    this.drawRect(0, 0, w, h, backgroundColor, backgroundColor);

    const width = 32;
    const height = 32;
    const p = 4;

    const path1 = new Path2D();
    path1.moveTo(-0.5 * width, -0.5 * height);
    path1.lineTo(0.5 * width, -0.5 * height);
    path1.arcTo(0.5 * width, 0.5 * height, -0.5 * width, 0.5 * height, width);
    path1.lineTo(-0.5 * width, -0.5 * height);

    function draw(x, y) {
      const type = rnd();
      switch (type) {
        case 0: // empty
          break;
        case 1: // big circle
          this.colorCtx.save();
          this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.colorCtx.fillStyle =
            colorPalette[~~(Math.random() * colorPalette.length)];
          this.colorCtx.beginPath();
          this.colorCtx.arc(0, 0, 0.5 * width, 0, 2 * Math.PI);
          this.colorCtx.fill();
          this.colorCtx.restore();

          this.roughnessCtx.save();
          this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.roughnessCtx.fillStyle =
            specPalette[~~(Math.random() * specPalette.length)];
          this.roughnessCtx.beginPath();
          this.roughnessCtx.arc(0, 0, 0.5 * width, 0, 2 * Math.PI);
          this.roughnessCtx.fill();
          this.roughnessCtx.restore();
          break;
        case 2: // small circle
          this.colorCtx.save();
          this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.colorCtx.fillStyle =
            colorPalette[~~(Math.random() * colorPalette.length)];
          this.colorCtx.beginPath();
          this.colorCtx.arc(0, 0, 0.25 * width, 0, 2 * Math.PI);
          this.colorCtx.fill();
          this.colorCtx.restore();

          this.roughnessCtx.save();
          this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.roughnessCtx.fillStyle =
            specPalette[~~(Math.random() * specPalette.length)];
          this.roughnessCtx.beginPath();
          this.roughnessCtx.arc(0, 0, 0.25 * width, 0, 2 * Math.PI);
          this.roughnessCtx.fill();
          this.roughnessCtx.restore();
          break;
        case 3: // quarter
          const a = 0.5 * ~~(Math.random() * 4) * Math.PI;
          this.colorCtx.save();
          this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.colorCtx.rotate(a);
          this.colorCtx.fillStyle =
            colorPalette[~~(Math.random() * colorPalette.length)];
          this.colorCtx.fill(path1);
          this.colorCtx.restore();

          this.roughnessCtx.save();
          this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
          this.roughnessCtx.rotate(a);
          this.roughnessCtx.fillStyle =
            specPalette[~~(Math.random() * specPalette.length)];
          this.roughnessCtx.fill(path1);
          this.roughnessCtx.restore();
          break;
      }
    }

    const _d = draw.bind(this);

    let id;
    for (let y = -1; y < h / height; y++) {
      for (let x = -1; x < w / width; x++) {
        _d(x, y);
      }
    }
  }
}
export { Paper };

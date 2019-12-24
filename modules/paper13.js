import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    const backgroundColor = "#4a4041";
    const specColorRim = "#ddd";
    const colorPalette1 = [
      "#eed33d",
      "#db4543",
      "#7cb2c1",
      "#6a5241",
      "#e07f34",
      "#84858a",
      "#e8d2be",
      "#dfe5cd",
      "#e7cc36"
    ];

    var colorPalette2 = ["#f6f6f6", "#ff9b00", "#ff3200", "#02827a"];

    const palettes = [colorPalette1];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const specPalette = ["#eee", "#aaa", "#888", "#666", "#444"];

    this.colorCtx.strokeStyle = "#fff";
    this.roughnessCtx.strokeStyle = "#fff";

    this.drawRect(0, 0, w, h, backgroundColor, "#000");

    const width = 32;
    const height = 32;
    const p = 4;

    const path1 = new Path2D();
    path1.moveTo(0.5 * width, 0 + p);
    path1.lineTo(width - p, height - p);
    path1.lineTo(0 + p, height - p);
    path1.lineTo(0.5 * width, 0 + p);

    const path2 = new Path2D();
    path2.moveTo(0.5 * width, height - p);
    path2.lineTo(width - p, 0 + p);
    path2.lineTo(0 + p, 0 + p);
    path2.lineTo(0.5 * width, height - p);

    function draw(x, y) {
      this.colorCtx.save();
      this.colorCtx.translate(x * width, y * height + 2 * p);
      this.colorCtx.fillStyle =
        colorPalette[~~(Math.random() * colorPalette.length)];
      this.colorCtx.fill(path1);
      this.colorCtx.stroke(path1);
      this.colorCtx.restore();

      this.colorCtx.save();
      this.colorCtx.translate((x + 0.5) * width, y * height);
      this.colorCtx.fillStyle =
        colorPalette[~~(Math.random() * colorPalette.length)];
      this.colorCtx.fill(path2);
      this.colorCtx.stroke(path2);
      this.colorCtx.restore();

      this.roughnessCtx.save();
      this.roughnessCtx.translate(x * width, y * height + 2 * p);
      this.roughnessCtx.fillStyle =
        specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fill(path1);
      this.roughnessCtx.stroke(path1);
      this.roughnessCtx.restore();

      this.roughnessCtx.save();
      this.roughnessCtx.translate((x + 0.5) * width, y * height);
      this.roughnessCtx.fillStyle =
        specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fill(path2);
      this.roughnessCtx.stroke(path2);
      this.roughnessCtx.restore();
    }

    const _d = draw.bind(this);

    let id;
    for (let y = -1; y < h / height; y++) {
      for (let x = -1; x < w / width; x++) {
        _d(x + (y % 2 ? 0.5 : 0), y);
      }
    }
  }
}
export { Paper };

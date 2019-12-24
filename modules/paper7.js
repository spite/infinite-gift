import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    var colorPalette = ["#f6f6f6", "#ff9b00", "#ff3200", "#02827a", "#330a2d"];

    var specPalette = ["#eee", "#aaa", "#888", "#666", "#444"];

    this.drawRect(0, 0, w, h, "#340a2d", "#000");

    const width = 48;
    const height = 32;

    const path = new Path2D();
    path.moveTo(0, 0.5 * height);
    path.lineTo(0.25 * width, 0);
    path.lineTo(0.5 * width, 0);
    path.lineTo(0.75 * width, 0.5 * height);
    path.lineTo(0.5 * width, height);
    path.lineTo(0.25 * width, height);
    path.lineTo(0, 0.5 * height);

    let id;
    for (let y = -1; y < h / height + 1; y++) {
      for (let x = -1; x < w / width + 1; x++) {
        this.colorCtx.save();
        this.colorCtx.translate(x * width, y * height);
        id = ~~(Math.random() * colorPalette.length);
        this.colorCtx.fillStyle = colorPalette[id];
        this.colorCtx.fill(path);
        this.colorCtx.restore();
        this.colorCtx.save();
        this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
        id = ~~(Math.random() * colorPalette.length);
        this.colorCtx.fillStyle = colorPalette[id];
        this.colorCtx.fill(path);
        this.colorCtx.restore();
        this.colorCtx.save();
        this.colorCtx.translate((x + 0.25 * 0.75) * width, (y + 0.25) * height);
        this.colorCtx.scale(0.5, 0.5);
        id = ~~(Math.random() * colorPalette.length);
        this.colorCtx.fillStyle = colorPalette[id];
        this.colorCtx.fill(path);
        this.colorCtx.restore();
        this.colorCtx.save();
        this.colorCtx.translate(
          (x + 0.5 + 0.75 * 0.25) * width,
          (y + 0.75) * height
        );
        this.colorCtx.scale(0.5, 0.5);
        id = ~~(Math.random() * colorPalette.length);
        this.colorCtx.fillStyle = colorPalette[id];
        this.colorCtx.fill(path);
        this.colorCtx.restore();
        this.roughnessCtx.save();
        this.roughnessCtx.translate(x * width, y * height);
        id = ~~(Math.random() * specPalette.length);
        this.roughnessCtx.fillStyle = specPalette[id];
        this.roughnessCtx.fill(path);
        this.roughnessCtx.restore();
        this.roughnessCtx.save();
        this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
        id = ~~(Math.random() * specPalette.length);
        this.roughnessCtx.fillStyle = specPalette[id];
        this.roughnessCtx.fill(path);
        this.roughnessCtx.restore();
        this.roughnessCtx.save();
        this.roughnessCtx.translate(
          (x + 0.25 * 0.75) * width,
          (y + 0.25) * height
        );
        this.roughnessCtx.scale(0.5, 0.5);
        id = ~~(Math.random() * specPalette.length);
        this.roughnessCtx.fillStyle = specPalette[id];
        this.roughnessCtx.fill(path);
        this.roughnessCtx.restore();
        this.roughnessCtx.save();
        this.roughnessCtx.translate(
          (x + 0.5 + 0.75 * 0.25) * width,
          (y + 0.75) * height
        );
        this.roughnessCtx.scale(0.5, 0.5);
        id = ~~(Math.random() * specPalette.length);
        this.roughnessCtx.fillStyle = specPalette[id];
        this.roughnessCtx.fill(path);
        this.roughnessCtx.restore();
      }
    }
  }
}

export { Paper };

import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    const backgroundColor = "#bbe6fc";
    const specColorRim = "#ddd";
    const colorPalette1 = [
      "#fef4b5",
      "#ffec5f",
      "#f29b9e",
      "#ef6660",
      "#6d7db8",
      "#162661"
    ];

    const palettes = [colorPalette1];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const specPalette = ["#eee", "#aaa", "#888", "#666", "#444"];

    this.roughnessCtx.strokeStyle = "#fff";
    this.drawRect(0, 0, w, h, backgroundColor, backgroundColor);

    const width = 32;
    const height = 32;

    function draw(x, y) {
      const a = Math.random() * 2 * Math.PI;

      this.colorCtx.lineWidth = 0.25 * width;
      this.colorCtx.save();
      this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
      this.colorCtx.rotate(a);
      this.colorCtx.fillStyle =
        colorPalette[~~(Math.random() * colorPalette.length)];
      this.colorCtx.fillRect(
        -0.25 * width,
        -0.25 * height,
        0.5 * width,
        0.5 * height
      );
      this.colorCtx.restore();

      this.roughnessCtx.lineWidth = 0.25 * width;
      this.roughnessCtx.save();
      this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
      this.roughnessCtx.rotate(a);
      this.roughnessCtx.fillStyle =
        specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fillRect(
        -0.3 * width,
        -0.3 * height,
        0.6 * width,
        0.6 * height
      );
      this.roughnessCtx.restore();
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

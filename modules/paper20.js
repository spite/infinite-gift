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

    const width = 64;
    const height = 64;

    function draw(x, y) {
      const count = ~~(Math.random() * 2);
      this.colorCtx.save();
      this.colorCtx.translate((x + 0.5) * width, (y + 0.5) * height);
      const bkg = colorPalette[~~(Math.random() * colorPalette.length)];
      this.colorCtx.fillStyle = bkg;
      this.colorCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
      let c;
      do {
        c = colorPalette[~~(Math.random() * colorPalette.length)];
      } while (c === bkg);
      this.colorCtx.strokeStyle = c;
      this.colorCtx.fillStyle = c;
      this.colorCtx.lineWidth = width / 3;
      if (count == 0) {
        this.colorCtx.beginPath();
        this.colorCtx.arc(
          -0.5 * width,
          -0.5 * height,
          0.5 * width,
          0,
          Math.PI / 2
        );
        this.colorCtx.stroke();
        this.colorCtx.rotate(Math.PI);
        this.colorCtx.beginPath();
        this.colorCtx.arc(
          -0.5 * width,
          -0.5 * height,
          0.5 * width,
          0,
          Math.PI / 2
        );
        this.colorCtx.stroke();
      }
      if (count == 1) {
        for (let a = 0; a < 4; a++) {
          this.colorCtx.save();
          this.colorCtx.rotate((a * Math.PI) / 2);
          this.colorCtx.beginPath();
          this.colorCtx.arc(
            -0.5 * width,
            -0.5 * height,
            0.5 * width,
            0,
            Math.PI / 2
          );
          this.colorCtx.stroke();
          this.colorCtx.fillRect(
            -0.1 * width,
            -0.1 * height,
            0.2 * width,
            0.2 * height
          );
          this.colorCtx.restore();
        }
      }
      this.colorCtx.restore();

      this.roughnessCtx.save();
      this.roughnessCtx.translate((x + 0.5) * width, (y + 0.5) * height);
      this.roughnessCtx.fillStyle =
        specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
      this.roughnessCtx.strokeStyle =
        specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fillStyle = this.roughnessCtx.strokeStyle;
      this.roughnessCtx.lineWidth = width / 2.5;
      if (count == 0) {
        this.roughnessCtx.beginPath();
        this.roughnessCtx.arc(
          -0.5 * width,
          -0.5 * height,
          0.5 * width,
          0,
          Math.PI / 2
        );
        this.roughnessCtx.stroke();
        this.roughnessCtx.rotate(Math.PI);
        this.roughnessCtx.beginPath();
        this.roughnessCtx.arc(
          -0.5 * width,
          -0.5 * height,
          0.5 * width,
          0,
          Math.PI / 2
        );
        this.roughnessCtx.stroke();
      }
      if (count == 1) {
        for (let a = 0; a < 4; a++) {
          this.roughnessCtx.save();
          this.roughnessCtx.rotate((a * Math.PI) / 2);
          this.roughnessCtx.beginPath();
          this.roughnessCtx.arc(
            -0.5 * width,
            -0.5 * height,
            0.5 * width,
            0,
            Math.PI / 2
          );
          this.roughnessCtx.stroke();
          this.roughnessCtx.fillRect(
            -0.1 * width,
            -0.1 * height,
            0.2 * width,
            0.2 * height
          );
          this.roughnessCtx.restore();
        }
      }
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

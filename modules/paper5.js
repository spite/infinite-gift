import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    const opts1 = { specularColor: "#000" };

    const colorPalette1 = ["#f1c12f", "#c6c6c6", "#fefefe", "#20bfd2", "#6c6c6c", "#484148"];
    const colorPalette11 = ["#fefefe", "#c6c6c6", "#484148", "#6c6c6c", "#f1c12f", "#20bfd2"];
    const colorPalette2 = ["#d23177", "#ffffff", "#ef562d", "#ffe156"];
    const colorPalette21 = ["#ffffff", "#d23177", "#ef562d", "#ffe156"];
    const colorPalette3 = ["#d71e75", "#ef562d", "#98d6e1", "#f6d258", ];
    const colorPalette31 = ["#d71e75", "#ef562d", "#f6d258", "#98d6e1"];

    const palettes = [colorPalette1, colorPalette11, colorPalette2, colorPalette21, colorPalette3, colorPalette31];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    colorPalette.sort((a, b) =>
      Math.random() * 2 - 1);
    console.log(colorPalette)

    const width = 32;
    const height = 32;

    this.drawRect(0, 0, w, h, "#fff", opts1);
    for (let y = -1; y < h / height + 1; y++) {
      for (let x = -1; x < w / width + 1; x++) {

        const path = new Path2D();
        if (x % 2) {
          path.moveTo(x * width, y * height);
          path.lineTo((x + 1) * width, (y + 1) * height);
          path.lineTo((x + 1) * width, (y + 2) * height);
          path.lineTo(x * width, (y + 1) * height);
          path.lineTo(x * width, y * height);
        } else {
          path.moveTo(x * width, (y + 1) * height);
          path.lineTo(x * width, (y + 2) * height);
          path.lineTo((x + 1) * width, (y + 1) * height);
          path.lineTo((x + 1) * width, y * height);
          path.lineTo(x * width, (y + 1) * height);
        }

        this.colorCtx.fillStyle = colorPalette[(2 * y) % colorPalette.length + (x % 2)];
        this.colorCtx.fill(path);

        const c = ~~(Math.random() * 255);
        this.roughnessCtx.fillStyle = `rgb(${c},${c},${c})`;
        this.roughnessCtx.fill(path);
      }
    }


  }
}

export { Paper }
import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    const opts1 = { specularColor: "#000" };

    const colorPalette1 = [
      '#d88559',
      '#dda8c4',
      '#c1454d',
      '#8cc6dc',
      '#ead562',
      '#fefff8'
    ];

    const colorPalette2 = [
      '#f97a4d',
      '#4199bd',
      '#455b69',
      '#c33a4e',
      '#eaeaec',
      '#e2e5de',
    ];

    const palettes = [colorPalette1, colorPalette2];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const width = 32;
    const height = 32;

    this.drawRect(0, 0, w, h, "#fff", opts1);
    for (let y = -1; y < h / height + 1; y++) {
      for (let x = -1; x < w / width + 1; x++) {

        const path1 = new Path2D();
        const path2 = new Path2D();
        if ((x + y) % 2) {
          path1.moveTo(x * width, y * height);
          path1.lineTo((x + 1) * width, y * height);
          path1.lineTo(x * width, (y + 1) * height);
          path2.moveTo((x + 1) * width, y * height);
          path2.lineTo((x + 1) * width, (y + 1) * height);
          path2.lineTo(x * width, (y + 1) * height);
        } else {
          path1.moveTo(x * width, y * height);
          path1.lineTo((x + 1) * width, y * height);
          path1.lineTo((x + 1) * width, (y + 1) * height);
          path2.moveTo(x * width, y * height);
          path2.lineTo(x * width, (y + 1) * height);
          path2.lineTo((x + 1) * width, (y + 1) * height);
        }

        const id = ~~(Math.random() * colorPalette.length);
        this.colorCtx.fillStyle = colorPalette[id];
        this.colorCtx.fill(path1);
        let id2 = id;
        while (id2 === id) {
          id2 = ~~(Math.random() * colorPalette.length);
        }
        this.colorCtx.fillStyle = colorPalette[id2];
        this.colorCtx.fill(path2);

        let c = ~~(Math.random() * 255);
        this.roughnessCtx.fillStyle = `rgb(${c},${c},${c})`;
        this.roughnessCtx.fill(path1);
        c = ~~(Math.random() * 255);
        this.roughnessCtx.fillStyle = `rgb(${c},${c},${c})`;
        this.roughnessCtx.fill(path2);
      }
    }


  }
}

export { Paper }
import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    const backgroundColor = '#efe8cc';
    const specColorRim = '#ddd';
    const colorPalette1 = [
      '#a39f8a',
      '#5d697a',
      '#c0cb3c',
      '#fea43b',
      '#90d6cf',
      '#efe8cc',
    ];

    const palettes = [colorPalette1];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const specPalette = [
      "#eee",
      "#aaa",
      "#888",
      "#666",
      "#444"
    ];

    this.roughnessCtx.strokeStyle = '#fff';
    this.drawRect(0, 0, w, h, backgroundColor, backgroundColor);

    const width = 32;
    const height = 32;
    const p = 4;

    const path1 = new Path2D();
    path1.moveTo(-.5 * width, -.5 * height);
    path1.lineTo(.5 * width, -.5 * height);
    path1.arcTo(.5 * width, .5 * height, -.5 * width, .5 * height, width);
    path1.lineTo(-.5 * width, -.5 * height);

    function draw(x, y) {
      const a = ~~(Math.random() * 4) * Math.PI / 2;
      this.colorCtx.save();
      this.colorCtx.translate((x + .5) * width, (y + .5) * height);
      this.colorCtx.rotate(a);
      this.colorCtx.fillStyle = colorPalette[~~(Math.random() * colorPalette.length)];
      this.colorCtx.fill(path1);
      this.colorCtx.restore();

      this.roughnessCtx.save();
      this.roughnessCtx.translate((x + .5) * width, (y + .5) * height);
      this.roughnessCtx.rotate(a);
      this.roughnessCtx.fillStyle = specPalette[~~(Math.random() * specPalette.length)];
      this.roughnessCtx.fill(path1);
      this.roughnessCtx.stroke(path1);
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
export { Paper }
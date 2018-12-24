import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    const colorRim = '#4f919b';
    const specColorRim = '#ddd';
    const colorPalette1 = [
      '#d24b58',
      '#c34e55',
      '#cbe2ee',
      '#ecf0f3'
    ];

    var colorPalette2 = [
      "#f6f6f6",
      "#ff9b00",
      "#ff3200",
      "#02827a",
    ];

    const palettes = [colorPalette1, colorPalette2];
    const colorPalette = palettes[~~(Math.random() * palettes.length)];

    const specPalette = [
      "#eee",
      "#aaa",
      "#888",
      "#666",
      "#444"
    ];

    this.drawRect(0, 0, w, h, '#340a2d', '#000');

    const width = 4 * 48;
    const height = 4 * 32;

    const path = new Path2D();
    path.moveTo(0, .5 * height);
    path.lineTo(.25 * width, 0);
    path.lineTo(.5 * width, 0);
    path.lineTo(.75 * width, .5 * height);
    path.lineTo(.5 * width, height);
    path.lineTo(.25 * width, height);
    path.lineTo(0, .5 * height);

    function draw(x, y) {
      this.colorCtx.save();
      this.colorCtx.translate(x * width, y * height);
      this.colorCtx.fillStyle = colorRim;
      this.colorCtx.fill(path);
      this.colorCtx.restore();
      this.colorCtx.save();
      this.colorCtx.translate((x + 1) * width, (y + 1) * height);
      this.colorCtx.fillStyle = colorRim;
      this.colorCtx.fill(path);
      this.colorCtx.restore();
      const colors = colorPalette.sort((a, b) => Math.random() > .5 ? 1 : -1);
      let inc = .5 * .25;
      let scale = .75;
      const aspect = width / height;
      for (let c of colors) {
        this.colorCtx.save();
        this.colorCtx.translate((x + inc) * width, (y + .95 * inc * aspect) * height);
        this.colorCtx.scale(scale, scale);
        this.colorCtx.fillStyle = c;
        this.colorCtx.fill(path);
        this.colorCtx.restore();
        inc += .75 * .125 * scale;
        scale *= .75;
      }
      this.roughnessCtx.save();
      this.roughnessCtx.translate(x * width, y * height);
      this.roughnessCtx.fillStyle = specColorRim;
      this.roughnessCtx.fill(path);
      this.roughnessCtx.restore();
      this.roughnessCtx.save();
      this.roughnessCtx.translate((x + 1) * width, (y + 1) * height);
      this.roughnessCtx.fillStyle = specColorRim;
      this.roughnessCtx.fill(path);
      this.roughnessCtx.restore();
      const colors2 = specPalette.sort((a, b) => Math.random() > .5 ? 1 : -1);
      inc = .5 * .25;
      scale = .75;
      for (let c of colors2) {
        this.roughnessCtx.save();
        this.roughnessCtx.translate((x + inc) * width, (y + .95 * inc * aspect) * height);
        this.roughnessCtx.scale(scale, scale);
        this.roughnessCtx.fillStyle = c;
        this.roughnessCtx.fill(path);
        this.roughnessCtx.restore();
        inc += .75 * .125 * scale;
        scale *= .75;
      }
    }

    const _d = draw.bind(this);

    let id;
    for (let y = -1; y < h / height; y++) {
      for (let x = -1; x < w / width; x++) {
        _d(x, y);
        _d(x + .5, y + .5);
      }
    }
  }
}
export { Paper }
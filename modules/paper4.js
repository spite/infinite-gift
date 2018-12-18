import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#000" };
    const opts2 = { specularColor: "#fff" };

    var colorPalette = [];
    colorPalette.push("#89d5da");
    colorPalette.push("#4f4f41");
    colorPalette.push("#f6bd1f");
    colorPalette.push("#b1a881");
    colorPalette.push("#fbd66c");

    const f = 512 / w;
    const v = w * 16 / 512;

    for (var i = 0; i < v; i++) {
      for (var j = 0; j < v; j++) {
        //Draw background
        var paletteIndex = Math.floor(Math.random() * colorPalette.length);
        this.drawRect(i * (w / v), j * (h / v), (w / v), (h / v), colorPalette[paletteIndex], opts1);
      }
    }

    var sourceTmpCanvas = document.createElement('canvas');
    var destinationTmpCanvas = document.createElement('canvas');
    destinationTmpCanvas.setAttribute('width', w);
    destinationTmpCanvas.setAttribute('height', h);
    sourceTmpCanvas.setAttribute('width', w);
    sourceTmpCanvas.setAttribute('height', h);
    var srcCtx = sourceTmpCanvas.getContext('2d');
    var dstCtx = destinationTmpCanvas.getContext('2d');

    srcCtx.drawImage(this.colorCanvas, 0, 0);

    this.colorCtx.clearRect(0, 0, w, h);
    for (var i = 0; i <= v; i++) {
      for (var j = 0; j <= v; j++) {
        //Draw arcs inside the arcs
        var startAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
        var arcRadians = Math.ceil(Math.random() * 4) * (Math.PI / 2);
        //this.drawArc((i * (512 / v)) + ((512 / v / 2)), (j * (512 / v)) + ((512 / v / 2)), (512 / v / 2), startAngle, arcRadians, "#aaa", opts2);
        this.drawArc((i * (w / v)), (j * (h / v)), (w / v / 2), startAngle, arcRadians, "#aaa", opts2);
      }
    }

    dstCtx.drawImage(this.colorCanvas, 0, 0);

    this.colorCtx.clearRect(0, 0, w, h);

    this.colorCtx.drawImage(sourceTmpCanvas, 0, 0, w, h);
    this.colorCtx.globalCompositeOperation = "destination-in";
    this.colorCtx.drawImage(destinationTmpCanvas, 0, 0, w, h);
    this.colorCtx.globalCompositeOperation = "destination-over";
    this.drawRect(0, 0, w, h, "#fff");
    this.colorCtx.globalCompositeOperation = "source-over";
    //Draw circles inside the arcs
    for (var i = 0; i <= v; i++) {
      for (var j = 0; j <= v; j++) {
        var paletteIndex = Math.floor(Math.random() * colorPalette.length);
        var circleWidth = Math.max(Math.ceil(Math.random() * ((w / v / 2) - 10 * f)), 0);
        this.drawCircle(i * (w / v), j * (h / v), circleWidth, colorPalette[paletteIndex], opts2);
      }
    }

  }
}

export { Paper }
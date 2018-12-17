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

    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 13; j++) {
        //Draw background
        var paletteIndex = Math.floor(Math.random() * colorPalette.length);
        this.drawRect(i * (w / 13), j * (h / 13), (w / 13), (h / 13), colorPalette[paletteIndex], opts1);
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
    for (var i = 0; i < 14; i++) {
      for (var j = 0; j < 14; j++) {
        //Draw arcs inside the arcs
        var startAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
        var arcRadians = Math.ceil(Math.random() * 4) * (Math.PI / 2);
        //this.drawArc((i * (512 / 13)) + ((512 / 13 / 2)), (j * (512 / 13)) + ((512 / 13 / 2)), (512 / 13 / 2), startAngle, arcRadians, "#aaa", opts2);
        this.drawArc((i * (w / 13)), (j * (h / 13)), (w / 13 / 2), startAngle, arcRadians, "#aaa", opts2);
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
    for (var i = 0; i < 14; i++) {
      for (var j = 0; j < 14; j++) {
        var paletteIndex = Math.floor(Math.random() * colorPalette.length);
        var circleWidth = Math.ceil(Math.random() * ((w / 13 / 2) - 10));
        this.drawCircle(i * (w / 13), j * (h / 13), circleWidth, colorPalette[paletteIndex], opts2);
      }
    }

  }
}

export { Paper }
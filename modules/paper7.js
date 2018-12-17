import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    var colorPalette = [];
    colorPalette.push("#f6f6f6");
    colorPalette.push("#ff9b00");
    colorPalette.push("#ff3200");
    colorPalette.push("#02827a");
    colorPalette.push("#330a2d");

    var specPalette = [];
    specPalette.push("#eee");
    specPalette.push("#aaa");
    specPalette.push("#888");
    specPalette.push("#666");
    specPalette.push("#444");

    this.drawRect(0, 0, 512, 512, '#340a2d', '#000');

    function d(x, y, r, c) {
      var paletteIndex = Math.floor(Math.random() * colorPalette.length);
      this.drawCircle(x, y, r, colorPalette[paletteIndex], opts1);
      this.colorCtx.beginPath();
      this.colorCtx.lineWidth = .5;
      this.colorCtx.strokeStyle = 0xc5c5c5;
      this.colorCtx.arc(x, y, r, 0, 2 * Math.PI);
      this.colorCtx.stroke();
    }
    const _d = d.bind(this);

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var x = i * (512 / 8),
          y = j * (512 / 8),
          rr = 256 / 8;

        x += rr;
        y += rr;
        var r = Math.random() * rr;
        if (r < 15) r = 15;
        while (r > 0) {
          var paletteIndex = Math.floor(Math.random() * colorPalette.length);
          this.drawRect(x - r, y - r, 2 * r, 2 * r, colorPalette[paletteIndex], { specularColor: specPalette[paletteIndex] });
          r -= 2 + Math.random() * 5;
        }
      }
    }

  }
}

export { Paper }
import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    var colorPalette = ["#ebe9e4", "#f56f34", "#ee4537", "#372c2c"];

    const line = '#c5c5c5';

    this.drawRect(0, 0, w, h, '#fff', '#000');

    function d(x, y, r, c) {
      var paletteIndex = Math.floor(Math.random() * colorPalette.length);
      this.drawCircle(x, y, r, colorPalette[paletteIndex], { specularColor: "#fff" });
      this.colorCtx.beginPath();
      this.colorCtx.lineWidth = .5;
      this.colorCtx.strokeStyle = 0xc5c5c5;
      this.colorCtx.arc(x, y, r, 0, 2 * Math.PI);
      this.colorCtx.stroke();
    };

    const _d = d.bind(this);
    const f = w / 64;

    for (var i = 0; i < f; i++) {
      for (var j = 0; j < f; j++) {
        var paletteIndex = Math.floor(Math.random() * colorPalette.length);
        var x = i * (w / f),
          y = j * (h / f),
          r = .5 * w / f,
          m = Math.floor(Math.random() * 3);
        switch (m) {
          case 0:
            _d(x + .5 * w / f, y + .5 * h / f, r);
            break;
          case 1:
            var rr = r / 2;
            for (var ii = 0; ii < 2; ii++) {
              for (var jj = 0; jj < 2; jj++) {
                _d(x + rr + 2 * ii * rr, y + rr + jj * 2 * rr, rr);
              }
            }
            break;
          case 2:
            var rr = r / 3;
            for (var ii = 0; ii < 3; ii++) {
              for (var jj = 0; jj < 3; jj++) {
                var paletteIndex = Math.floor(Math.random() * colorPalette.length);
                _d(x + rr + 2 * ii * rr, y + rr + jj * 2 * rr, rr);
              }
            }
            break;
        }
      }
    }
  }
}

export { Paper }
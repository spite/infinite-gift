import { WrappingPaper } from './wrapping-paper.js';

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    const colorPalette = [
      "#f0f0f0",
      "#ff8b00",
      "#ff2b00",
      "#d90a00",
      "#02756e",
      "#2c0826",
      "#2d0826"
    ];

    const line = '#c5c5c5';

    this.drawRect(0, 0, w, h, '#fff', '#000');

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var x = i * (w / 8),
          y = j * (h / 8),
          rr = .5 * w / 8;

        x += rr;
        y += rr;
        var r = Math.random() * rr;
        if (r < 15) r = 15;
        while (r > 0) {
          var paletteIndex = Math.floor(Math.random() * colorPalette.length);
          this.drawCircle(x, y, r, colorPalette[paletteIndex], { specularColor: "#fff" });
          r -= 2 + Math.random() * 5;
        }
      }
    }
  }
}

export { Paper }
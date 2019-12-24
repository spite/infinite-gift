import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    var colorPalette = [];
    colorPalette.push("#edece8");
    colorPalette.push("#db6644");
    colorPalette.push("#b44137");
    colorPalette.push("#4c7b7f");
    colorPalette.push("#0a0a0f");

    var specPalette = [];
    specPalette.push("#eee");
    specPalette.push("#aaa");
    specPalette.push("#888");
    specPalette.push("#666");
    specPalette.push("#444");

    this.drawRect(0, 0, 512, 512, "#fff", "#000");

    function draw(x, y, w, h, s, depth, l) {
      l++;

      for (var i = 0; i < s; i++) {
        for (var j = 0; j < s; j++) {
          var xx = x + i * (w / s),
            yy = y + j * (h / s),
            d = w / s;

          if (l == 1) {
            depth = Math.floor(Math.random() * 4);
          }

          if (l < depth) {
            _d(xx, yy, d, d, depth, l);
          } else {
            var paletteIndex = Math.floor(Math.random() * colorPalette.length);
            this.drawRect(xx, yy, d, d, colorPalette[paletteIndex], {
              specularColor: specPalette[paletteIndex]
            });
          }
        }
      }
    }
    const _d = draw.bind(this);

    _d(0, 0, 512, 512, 15, Math.floor(Math.random() * 3), 0);
  }
}

export { Paper };

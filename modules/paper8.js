import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    var colorPalette = [];
    colorPalette.push("#ffffdd");
    colorPalette.push("#f4c361");
    colorPalette.push("#efad1c");
    colorPalette.push("#badfd9");
    colorPalette.push("#80cacd");
    colorPalette.push("#a29c7c");
    colorPalette.push("#574f40");

    var specPalette = [];
    specPalette.push("#eee");
    specPalette.push("#aaa");
    specPalette.push("#888");
    specPalette.push("#666");
    specPalette.push("#444");

    this.drawRect(0, 0, 512, 512, "#fff", "#000");

    var s = 512 / 15;
    for (var y = 0; y < 512; y += s) {
      for (var x = 0; x < 512; x += s) {
        var steps = Math.ceil(Math.random() * 8);
        var dir = Math.random() > 0.5;
        for (var i = 0; i < s; i += s / steps) {
          var paletteIndex = Math.floor(Math.random() * colorPalette.length);
          var opts = { specularColor: specPalette[paletteIndex] };
          if (dir) {
            this.drawRect(
              x + i,
              y,
              s / steps,
              s,
              colorPalette[paletteIndex],
              opts
            );
          } else {
            this.drawRect(
              x,
              y + i,
              s,
              s / steps,
              colorPalette[paletteIndex],
              opts
            );
          }
        }
      }
    }
  }
}

export { Paper };

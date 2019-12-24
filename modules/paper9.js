import { WrappingPaper } from "./wrapping-paper.js";

class Paper extends WrappingPaper {
  constructor(w, h) {
    super(w, h);

    //object that defines the specular level for the specular image
    const opts1 = { specularColor: "#fff" };

    var colorPalette = [];

    if (Math.random() > 0.5) {
      colorPalette.push("#dfd8d4");
      colorPalette.push("#adabb7");
      colorPalette.push("#d41a2e");
      colorPalette.push("#230c41");
      colorPalette.push("#17080e");
    } else {
      colorPalette.push("#ffffdd");
      colorPalette.push("#f4c361");
      colorPalette.push("#efad1c");
      colorPalette.push("#badfd9");
      colorPalette.push("#80cacd");
      colorPalette.push("#a29c7c");
      colorPalette.push("#574f40");
    }

    var specPalette = [];
    specPalette.push("#eee");
    specPalette.push("#aaa");
    specPalette.push("#888");
    specPalette.push("#777");
    specPalette.push("#666");
    specPalette.push("#555");
    specPalette.push("#444");

    this.drawRect(0, 0, 512, 512, "#fff", "#000");

    var s = 512;
    var steps = 5 + Math.ceil(Math.random() * 10);
    var dir = Math.random() > 0.5;
    for (var i = 0; i < s; i += s / steps) {
      var paletteIndex = Math.floor(Math.random() * colorPalette.length);
      var opts = { specularColor: specPalette[paletteIndex] };
      if (dir) {
        this.drawRect(i, 0, s / steps, s, colorPalette[paletteIndex], opts);
      } else {
        this.drawRect(0, i, s, s / steps, colorPalette[paletteIndex], opts);
      }
    }
  }
}

export { Paper };

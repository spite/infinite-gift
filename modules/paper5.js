import { WrappingPaper } from './wrapping-paper.js';

function pointDistance(point1, point2) {
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
}

class Paper extends WrappingPaper {

  constructor(w, h) {
    super(w, h);

    const opts1 = { specularColor: "#000" };
    const opts2 = { specularColor: "#fff", alpha: 1.0 };

    var colorPalette = [];
    colorPalette.push("#ffa916");
    colorPalette.push("#0980b1");
    colorPalette.push("#ff011d");
    colorPalette.push("#ff542b");
    colorPalette.push("#737373");
    colorPalette.push("#ffd6c9");
    colorPalette.push("#a2bbd4");
    colorPalette.push("#b184c2");
    colorPalette.push("#ffe468");
    colorPalette.push("#262626");

    this.drawRect(0, 0, 512, 512, "#fff", opts1);
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        this.colorCtx.strokeStyle = "#000";
        var centerX = (i * (512 / 8)) + ((512 / 8) / 2);
        var centerY = (j * (512 / 8)) + ((512 / 8) / 2);

        //ctx.strokeRect(i*(512/8),j*(512/8),(512/8),(512/8));
        for (var k = 0; k < 10; k++) {
          var limitRandom = 70;
          var randomDistributionX = 0.25 * (Math.random() + Math.random() + Math.random() + Math.random());
          var randomDistributionY = 0.25 * (Math.random() + Math.random() + Math.random() + Math.random());
          var randomDistributionSize = 0.25 * (Math.random() + Math.random() + Math.random() + Math.random());
          var randomX = (randomDistributionX * limitRandom) - (limitRandom / 2);
          var randomY = (randomDistributionY * limitRandom) - (limitRandom / 2);
          var distanceFromCenter = pointDistance({ x: centerX, y: centerY }, { x: (centerX + randomX), y: (centerY + randomY) });

          var distanceNormalize = (distanceFromCenter) / 35;
          opts2.alpha = (1 - (distanceNormalize * distanceNormalize));

          var paletteIndex = Math.floor(Math.random() * colorPalette.length);
          this.drawCircle(centerX + randomX, centerY + randomY, randomDistributionSize * 8, colorPalette[paletteIndex], opts2);
        }
      }
    }
  }
}

export { Paper }
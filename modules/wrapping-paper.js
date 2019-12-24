import { Maf } from "./maf.js";

class WrappingPaper {
  constructor(w = 1024, h = 1024) {
    this.width = w;
    this.height = h;

    this.colorCanvas = document.createElement("canvas");
    this.colorCanvas.width = w;
    this.colorCanvas.height = h;
    this.colorCtx = this.colorCanvas.getContext("2d");
    this.roughnessCanvas = document.createElement("canvas");
    this.roughnessCanvas.width = w;
    this.roughnessCanvas.height = h;
    this.roughnessCtx = this.roughnessCanvas.getContext("2d");
    this.metalnessCanvas = document.createElement("canvas");
    this.metalnessCanvas.width = w;
    this.metalnessCanvas.height = h;
    this.metalnessCtx = this.metalnessCanvas.getContext("2d");

    // document.body.appendChild(this.colorCanvas);
    // document.body.appendChild(this.roughnessCanvas);

    this.contexts = [this.colorCtx, this.roughnessCtx, this.metalnessCtx];
  }

  clearRect(originX, originY, width, height) {
    for (var i = 0; i < this.contexts.length; i++) {
      this.contexts[i].clearRect(originX, originY, width, height);
    }
  }

  drawRect(originX, originY, width, height, color, opts) {
    /* opts example
        opts = {
            strokeColor: "#fff",
            lineWidth: 10,
            specularColor: "#000",
            specularContext: ctxs
        };
    */
    var contexts = [this.colorCtx];
    var colors = [];
    if (color) colors[0] = color;
    else colors[0] = "#000";
    if (opts && this.roughnessCtx) {
      contexts[1] = this.roughnessCtx;
      if (opts.specularColor) colors[1] = opts.specularColor;
      else colors[1] = "#000";
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].fillStyle = colors[i];
      contexts[i].fillRect(originX, originY, width, height);
    }
  }

  drawArc(centerX, centerY, radius, start_radians, radians, color, opts) {
    var contexts = [this.colorCtx];
    var colors = [];
    if (color) colors[0] = this.hexToRgb(color);
    else colors[0] = this.hexToRgb("#000");
    var lineWidth = 10;
    if (radians === undefined) var radians = Math.PI / 2;
    if (opts && this.roughnessCtx) {
      contexts[1] = this.roughnessCtx;
      if (opts.specularColor) colors[1] = this.hexToRgb(opts.specularColor);
      else colors[1] = this.hexToRgb("#000");
      if (opts.lineWidth) lineWidth = opts.lineWidth;
      else lineWidth = 10;
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].beginPath();
      contexts[i].lineWidth = lineWidth;
      contexts[i].lineCap = "round";
      contexts[i].arc(centerX, centerY, radius, start_radians, radians, false);
      contexts[i].strokeStyle =
        "rgba(" + colors[i].r + "," + colors[i].g + "," + colors[i].b + ",1)";
      contexts[i].stroke();
    }
  }

  drawCircle(centerX, centerY, radius, color, opts) {
    var colors = [];
    var alpha = 1.0;
    if (color) colors[0] = this.hexToRgb(color);
    else colors[0] = this.hexToRgb("#000");
    const contexts = [this.colorCtx];
    if (opts) {
      contexts.push(this.roughnessCtx);
      if (opts.specularColor) colors[1] = this.hexToRgb(opts.specularColor);
      else colors[1] = this.hexToRgb("#000");
      if (opts.alpha) alpha = opts.alpha;
      else alpha = 1.0;
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].beginPath();
      contexts[i].arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      contexts[i].fillStyle =
        "rgba(" +
        colors[i].r +
        "," +
        colors[i].g +
        "," +
        colors[i].b +
        "," +
        alpha +
        ")";
      contexts[i].fill();
    }
  }

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
}

export { WrappingPaper };

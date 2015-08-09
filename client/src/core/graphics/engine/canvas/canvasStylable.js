/**
 * @fileoverview Canvas class representing a stylable element.
 */

goog.provide('xrx.canvas.Stylable');



goog.require('xrx.canvas.Element');
goog.require('xrx.engine');
goog.require('xrx.engine.Stylable');



/**
 * Canvas class representing a stylable element.
 * @param {HTMLCanvasElement} canvas The parent canvas element.
 * @constructor
 * @extends {xrx.canvas.Element}
 */
xrx.canvas.Stylable = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Stylable, xrx.canvas.Element);



/**
 * @private
 */
xrx.canvas.Stylable.prototype.strokeAndFill_ = function(graphic) {
  this.context_.fillStyle = graphic.getFillColor();
  this.context_.globalAlpha = graphic.getFillOpacity();
  this.context_.fill();
  this.context_.globalAlpha = 1;
  this.context_.strokeStyle = graphic.getStrokeColor();
  this.context_.lineWidth = graphic.getStrokeWidth();
  if (graphic.getStrokeWidth() > 0) this.context_.stroke();
};

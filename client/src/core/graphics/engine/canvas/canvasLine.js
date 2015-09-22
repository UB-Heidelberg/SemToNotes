/**
 * @fileoverview Canvas class representing a line.
 */

goog.provide('xrx.canvas.Line');



goog.require('xrx.canvas.Stylable');


/**
 * Canvas class representing a line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Line = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Line, xrx.canvas.Stylable);



/**
 * @private
 */
xrx.canvas.Line.prototype.drawPath_ = function(coords) {
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  this.context_.lineTo(coords[1][0], coords[1][1]);
};



/**
 * Draws the line.
 * @param {Array<Array<number>>} coords The coordinates of the line.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.canvas.Line.prototype.draw = function(coords, strokeColor, strokeWidth) {
  this.drawPath_(coords);
  this.strokeAndFill_(undefined, undefined, strokeColor, strokeWidth);
};



/**
 * Creates a new line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Line.create = function(canvas) {
  return new xrx.canvas.Line(canvas);
};

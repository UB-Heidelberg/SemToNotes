/**
 * @fileoverview VML class representing a line.
 */

goog.provide('xrx.vml.Line');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a line.
 * @param {Raphael.path} raphael The Raphael object.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Line = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Line, xrx.vml.Stylable);



/**
 * Sets the coordinates for this line.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.vml.Line.prototype.setCoords = function(coords) {
  xrx.vml.setCoords(this.raphael_, coords, false);
};



/**
 * Draws this line.
 * @param {number} x1 The x coordinate of the start point.
 * @param {number} y1 The y coordinate of the start point.
 * @param {number} x2 The x coordinate of the end point.
 * @param {number} y2 The y coordinate of the end point.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Line.prototype.draw = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
  this.setCoords([[x1, y1], [x2, y2]]);
  this.strokeAndFill_(undefined, undefined, strokeColor, strokeWidth);
};



/**
 * Creates a new line.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Line.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  return new xrx.vml.Line(raphael);
};

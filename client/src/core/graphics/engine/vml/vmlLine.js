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
 * @param {Array<Array<number>>} coords The coordinates of the line.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Line.prototype.draw = function(coords, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(undefined, undefined, strokeColor, strokeWidth);
  this.raphael_.show();
};



/**
 * Creates a new line.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Line.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Line(raphael);
};

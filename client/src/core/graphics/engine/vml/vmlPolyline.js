/**
 * @fileoverview VML class representing a poly-line.
 */

goog.provide('xrx.vml.Polyline');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a poly-line.
 * @param {Raphael.path} raphael The Raphael path object.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Polyline = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Polyline, xrx.vml.Stylable);



/**
 * Sets the coordinates for the poly-line.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.vml.Polyline.prototype.setCoords = function(coords) {
  xrx.vml.setCoords(this.raphael_, coords, false);
};



/**
 * Draws the polygon.
 * @param {Array<Array<number>>} coords The coordinates of the poly-line.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Polyline.prototype.draw = function(coords, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
  this.raphael_.show();
};



/**
 * Creates a new poly-line.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Polyline.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Polyline(raphael);
};

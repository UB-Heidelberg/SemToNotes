/**
 * @fileoverview VML class representing a polygon.
 */

goog.provide('xrx.vml.Polygon');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a polygon.
 * @param {Raphael.path} raphael The Raphael path object.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Polygon = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Polygon, xrx.vml.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.vml.Polygon.prototype.setCoords = function(coords) {
  xrx.vml.setCoords(this.raphael_, coords, true);
};



/**
 * Draws the polygon.
 * @param {Array<Array<number>>} coords The polygon's coordinates.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Polygon.prototype.draw = function(coords, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
  this.raphael_.show();
};



/**
 * Creates a new polygon.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Polygon.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Polygon(raphael);
};

/**
 * @fileoverview VML class representing a poly-line.
 */

goog.provide('xrx.vml.Polyline');



goog.require('xrx.geometry.Path');
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
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.vml.Polyline.prototype.draw = function(graphic) {
  this.setCoords(graphic.getGeometry().coords);
  this.strokeAndFill_(graphic);
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

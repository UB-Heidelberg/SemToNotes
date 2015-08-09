/**
 * @fileoverview VML class representing a polygon.
 */

goog.provide('xrx.vml.Polygon');



goog.require('xrx.geometry.Path');
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
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.vml.Polygon.prototype.draw = function(graphic) {
  this.setCoords(graphic.getGeometry().coords);
  this.strokeAndFill_(graphic);
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

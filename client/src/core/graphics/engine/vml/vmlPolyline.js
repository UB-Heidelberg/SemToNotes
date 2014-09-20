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

  goog.base(this, raphael, new xrx.geometry.Path());
};
goog.inherits(xrx.vml.Polyline, xrx.vml.Stylable);



/**
 * Sets the coordinates for the poly-line.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.vml.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.vml.setCoords(this.raphael_, coords, false);
};



/**
 * Returns the coordinates of the poly-line.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.vml.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Appends a coordinate to the poly-line.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.vml.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
  xrx.vml.setCoords(this.raphael_, this.geometry_.coords);
};



/**
 * Draws the polygon.
 */
xrx.vml.Polyline.prototype.draw = function() {
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

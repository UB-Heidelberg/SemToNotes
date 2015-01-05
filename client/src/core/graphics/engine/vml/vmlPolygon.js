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

  goog.base(this, raphael, new xrx.geometry.Path());
};
goog.inherits(xrx.vml.Polygon, xrx.vml.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.vml.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.vml.setCoords(this.raphael_, coords, true);
};



/**
 * Returns the coordinates of the polygon.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.vml.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Updates one coordinate in the list of coordinates.
 * @param {number} pos Index of the coordinate to be updated.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.vml.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
  xrx.vml.setCoords(this.raphael_, this.geometry_.coords, true);
};



/**
 * Draws the polygon.
 */
xrx.vml.Polygon.prototype.draw = function() {
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

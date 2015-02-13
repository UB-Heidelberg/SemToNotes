/**
 * @fileoverview Canvas class representing a polygon.
 */

goog.provide('xrx.canvas.Polygon');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Path');



/**
 * Canvas class representing a polygon.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Polygon = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
};
goog.inherits(xrx.canvas.Polygon, xrx.canvas.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.canvas.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
};



/**
 * Returns the coordinates of the polygon.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.canvas.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Updates one coordinate in the list of coordinates.
 * @param {number} pos Index of the coordinate to be updated.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.canvas.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
};



/**
 * @private
 */
xrx.canvas.Polygon.prototype.drawPath_ = function() {
  var coords = this.geometry_.coords;
  if (!coords[0]) return;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
  this.context_.lineTo(coords[0][0], coords[0][1]);
  this.context_.closePath();
};



/**
 * Draws the polygon.
 */
xrx.canvas.Polygon.prototype.draw = function() {
  this.drawPath_();
  this.strokeAndFill_();
};



/**
 * Creates a new polygon.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Polygon.create = function(canvas) {
  return new xrx.canvas.Polygon(canvas);
};

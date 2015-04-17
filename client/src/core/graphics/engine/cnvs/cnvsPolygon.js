/**
 * @fileoverview Canvas class representing a polygon.
 */

goog.provide('xrx.cnvs.Polygon');



goog.require('xrx.cnvs.Stylable');
goog.require('xrx.geometry.Path');



/**
 * Canvas class representing a polygon.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.cnvs.Stylable
 */
xrx.cnvs.Polygon = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
};
goog.inherits(xrx.cnvs.Polygon, xrx.cnvs.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.cnvs.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
};



/**
 * Returns the coordinates of the polygon.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.cnvs.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Updates one coordinate in the list of coordinates.
 * @param {number} pos Index of the coordinate to be updated.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.cnvs.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
};



/**
 * @private
 */
xrx.cnvs.Polygon.prototype.drawPath_ = function() {
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
xrx.cnvs.Polygon.prototype.draw = function() {
  this.drawPath_();
  this.strokeAndFill_();
};



/**
 * Creates a new polygon.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 */
xrx.cnvs.Polygon.create = function(canvas) {
  return new xrx.cnvs.Polygon(canvas);
};

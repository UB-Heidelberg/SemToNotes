/**
 * @fileoverview Canvas class representing a poly-line.
 */

goog.provide('xrx.canvas.Polyline');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Path');


/**
 * Canvas class representing a poly-line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Polyline = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
};
goog.inherits(xrx.canvas.Polyline, xrx.canvas.Stylable);



/**
 * Sets the coordinates for the poly-line.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.canvas.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
};



/**
 * Returns the coordinates of the poly-line.
 * @return {Array<Array<number>>} The coordinates.
 */
xrx.canvas.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Appends a coordinate to the poly-line.
 * @param {Array<number>} coord The new coordinate.
 */
xrx.canvas.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
};



/**
 * @private
 */
xrx.canvas.Polyline.prototype.drawPath_ = function() {
  var coords = this.geometry_.coords;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
};



/**
 * Draws the poly-line.
 * @param {number} scale The current scale of the view-box.
 */
xrx.canvas.Polyline.prototype.draw = function(scale) {
  this.drawPath_();
  this.strokeAndFill_(scale);
};



/**
 * Creates a new poly-line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Polyline.create = function(canvas) {
  return new xrx.canvas.Polyline(canvas);
};

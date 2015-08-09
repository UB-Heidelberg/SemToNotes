/**
 * @fileoverview Canvas class representing a rectangle.
 */

goog.provide('xrx.canvas.Rect');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Rect');



/**
 * Canvas class representing a rectangle.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends {xrx.canvas.Stylable}
 */
xrx.canvas.Rect = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Rect, xrx.canvas.Stylable);



/**
 * @private
 */
xrx.canvas.Rect.prototype.drawPath_ = function(graphic) {
  var coords = graphic.getGeometry().coords;
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
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.canvas.Rect.prototype.draw = function(graphic) {
  this.drawPath_(graphic);
  this.strokeAndFill_(graphic);
};



/**
 * Creates a new rectangle.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Rect.create = function(canvas) {
  return new xrx.canvas.Rect(canvas);
};

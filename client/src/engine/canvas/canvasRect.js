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

  goog.base(this, canvas, new xrx.geometry.Rect());
};
goog.inherits(xrx.canvas.Rect, xrx.canvas.Stylable);



/**
 * Sets the X coordinate of the rectangle.
 * @param {number} x The coordinate.
 */
xrx.canvas.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
};



/**
 * Sets the Y coordinate of the rectangle.
 * @param {number} y The coordinate.
 */
xrx.canvas.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
};



/**
 * Sets the width of the rectangle.
 * @param {number} width The width.
 */
xrx.canvas.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
};



/**
 * Sets the height of the rectangle.
 * @param {height} height The height.
 */
xrx.canvas.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
};



/**
 * Draws the rectangle.
 */
xrx.canvas.Rect.prototype.draw = function() {
  var x = this.geometry_.x;
  var y = this.geometry_.y;
  var width = this.geometry_.width;
  var height = this.geometry_.height;
  this.context_.beginPath();
  this.context_.moveTo(x, y);
  this.context_.lineTo(x, y + height);
  this.context_.lineTo(x + width, y + height);
  this.context_.lineTo(x + width, y);
  this.context_.closePath();
  this.strokeAndFill_();
};



/**
 * Creates a new rectangle.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Rect.create = function(canvas) {
  return new xrx.canvas.Rect(canvas);
};

/**
 * @fileoverview Canvas class representing a rectangle.
 */

goog.provide('xrx.cnvs.Rect');



goog.require('xrx.cnvs.Stylable');
goog.require('xrx.geometry.Rect');



/**
 * Canvas class representing a rectangle.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends {xrx.cnvs.Stylable}
 */
xrx.cnvs.Rect = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());
};
goog.inherits(xrx.cnvs.Rect, xrx.cnvs.Stylable);



/**
 * Sets the X coordinate of the rectangle.
 * @param {number} x The coordinate.
 */
xrx.cnvs.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
};



/**
 * Sets the Y coordinate of the rectangle.
 * @param {number} y The coordinate.
 */
xrx.cnvs.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
};



/**
 * Sets the width of the rectangle.
 * @param {number} width The width.
 */
xrx.cnvs.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
};



/**
 * Sets the height of the rectangle.
 * @param {height} height The height.
 */
xrx.cnvs.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
};



/**
 * Draws the rectangle.
 */
xrx.cnvs.Rect.prototype.draw = function() {
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
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 */
xrx.cnvs.Rect.create = function(canvas) {
  return new xrx.cnvs.Rect(canvas);
};

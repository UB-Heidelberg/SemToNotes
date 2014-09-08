/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Rect');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.graphic.Rect');



xrx.canvas.Rect = function(canvas) {

  goog.base(this, canvas);

  this.graphic_ = new xrx.graphic.Rect();
};
goog.inherits(xrx.canvas.Rect, xrx.canvas.Stylable);



xrx.canvas.Rect.prototype.setX = function(x) {
  this.graphic_.x = x;
};



xrx.canvas.Rect.prototype.setY = function(y) {
  this.graphic_.y = y;
};



xrx.canvas.Rect.prototype.setWidth = function(width) {
  this.graphic_.width = width;
};



xrx.canvas.Rect.prototype.setHeight = function(height) {
  this.graphic_.height = height;
};



xrx.canvas.Rect.prototype.draw = function() {
  var x = this.graphic_.x;
  var y = this.graphic_.y;
  var width = this.graphic_.width;
  var height = this.graphic_.height;
  this.context_.beginPath();
  this.context_.moveTo(x, y);
  this.context_.lineTo(x, y + height);
  this.context_.lineTo(x + width, y + height);
  this.context_.lineTo(x + width, y);
  this.context_.closePath();
  this.strokeAndFill_();
};



xrx.canvas.Rect.create = function(canvas) {
  return new xrx.canvas.Rect(canvas);
};

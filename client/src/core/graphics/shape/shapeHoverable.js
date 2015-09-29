/**
 * @fileoverview An abstract class representing an engine-independent
 * hoverable shape.
 */

goog.provide('xrx.shape.Hoverable');



xrx.shape.Hoverable = function(shape) {

  this.shape_ = shape;

  this.style_;
};



xrx.shape.Hoverable.prototype.setStyle = function(style) {
  this.style_ = style;
};

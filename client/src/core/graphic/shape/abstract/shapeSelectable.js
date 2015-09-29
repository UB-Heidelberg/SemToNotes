/**
 * @fileoverview An abstract class representing an engine-independent
 * selectable shape.
 */

goog.provide('xrx.shape.Selectable');



xrx.shape.Selectable = function(shape) {

  this.shape_ = shape;

  this.style_;
};



xrx.shape.Selectable.prototype.setStyle = function(style) {
  this.style_ = style;
};
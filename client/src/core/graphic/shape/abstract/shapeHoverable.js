/**
 * @fileoverview An abstract class representing an engine-independent
 * hoverable shape.
 */

goog.provide('xrx.shape.Hoverable');



goog.require('xrx.shape.Stylable');



xrx.shape.Hoverable = function(shape) {

  goog.base(this);

  this.shape_ = shape;

  this.store_ = new xrx.shape.Stylable();
};
goog.inherits(xrx.shape.Hoverable, xrx.shape.Stylable);



xrx.shape.Hoverable.prototype.hoverOn = function() {
  this.store_.setStyle(this.shape_);
  this.shape_.setStyle(this);
};



xrx.shape.Hoverable.prototype.hoverOff = function() {
  this.shape_.setStyle(this.store_);
};

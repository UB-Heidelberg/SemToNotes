/**
 * @fileoverview An abstract class representing an engine-independent
 * selectable shape.
 */

goog.provide('xrx.shape.Selectable');



goog.require('xrx.shape.Stylable');



/**
 * @constructor
 * @private
 */
xrx.shape.Selectable = function(shape) {

  goog.base(this);

  this.shape_ = shape;

  this.store_ = new xrx.shape.Stylable();
};
goog.inherits(xrx.shape.Selectable, xrx.shape.Stylable);



xrx.shape.Selectable.prototype.selectOn = function() {
  this.store_.setStyle(this.shape_);
  this.shape_.setStyle(this);
};



xrx.shape.Selectable.prototype.selectOff = function() {
  this.shape_.setStyle(this.store_);
};

/**
 * @fileoverview An abstract class representing an engine-independent
 * selectable shape.
 */

goog.provide('xrx.shape.Selectable');



goog.require('xrx.shape.Stylable');



/**
 * An abstract class representing an engine-independent
 * selectable shape.
 * @constructor
 * @private
 */
xrx.shape.Selectable = function(shape) {

  goog.base(this);

  /**
   * The target shape to be selected.
   * @type {xrx.shape.Shape}
   * @private
   */
  this.shape_ = shape;

  /**
   * Helper to restore the style when deselected.
   * @type {xrx.shape.Stylable}
   * @private
   */
  this.store_ = new xrx.shape.Stylable();
};
goog.inherits(xrx.shape.Selectable, xrx.shape.Stylable);



/**
 * Selects this shape.
 */
xrx.shape.Selectable.prototype.selectOn = function() {
  this.store_.setStyle(this.shape_);
  this.shape_.setStyle(this);
};



/**
 * De-selects this shape.
 */
xrx.shape.Selectable.prototype.selectOff = function() {
  this.shape_.setStyle(this.store_);
};



/**
 * Disposes this selectable shape.
 */
xrx.shape.Selectable.prototype.disposeInternal = function() {
  this.shape_.dispose();
  this.shape_ = null;
  this.store_.dispose();
  this.store_ = null;
  goog.base(this, 'disposeInternal');
};

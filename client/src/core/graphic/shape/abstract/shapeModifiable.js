/**
 * @fileoverview An abstract class representing a modifiable
 *   shape.
 */

goog.provide('xrx.shape.Modifiable');



/**
 * An abstract class representing a modifiable shape.
 * @constructor
 * @private
 */
xrx.shape.Modifiable = function(shape) {

  /**
   * The target shape of this modifiable shape.
   * @type {xrx.shape.Shape}
   * @private
   */
  this.shape_ = shape;

  /**
   * Draggers to modify this modifiable shape.
   * @type {Array<xrx.shape.Dragger>}
   * @private
   */
  this.dragger_ = [];
};



/**
 * Abstract function to be implemented by each modifiable shape.
 */
xrx.shape.Modifiable.prototype.setCoords = goog.abstractMethod;



/**
 * Abstract function to be implemented by each modifiable shape.
 */
xrx.shape.Modifiable.prototype.setCoordAt = goog.abstractMethod;



/**
 * Abstract function to be implemented by each modifiable shape.
 */
xrx.shape.Modifiable.prototype.move = goog.abstractMethod;



/**
 * Returns the target shape of this modifiable helper shape.
 * @return {xrx.shape.Shape} The target shape.
 */
xrx.shape.Modifiable.prototype.getShape = function() {
  return this.shape_;
};



/**
 * Returns the dragger elements of this modifiable helper shape.
 * @return {Array<xrx.shape.Dragger>} The dragger elements.
 */
xrx.shape.Modifiable.prototype.getDragger = function() {
  return this.dragger_;
};



/**
 * Returns the target shape of this modifiable helper shape.
 * @return {xrx.shape.Shape} The target shape.
 */
xrx.shape.Modifiable.prototype.setDragger = function(dragger) {
  this.dragger_ = dragger;
};



/**
 * Disposes this modifiable helper shape.
 */
xrx.shape.Modifiable.prototype.disposeInternal = function() {
  this.shape_.dispose();
  this.shape_ = null;
  for(var i = 0, len = this.dragger_.length; i < len; i++) {
    this.dragger_[i].dispose();
    this.dragger_[i] = null;
  }
  goog.base(this, 'disposeInternal');
};

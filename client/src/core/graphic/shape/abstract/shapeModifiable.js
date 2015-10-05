/**
 * @fileoverview An abstract class representing a modifiable
 *   shape.
 */

goog.provide('xrx.shape.Modifiable');



xrx.shape.Modifiable = function(shape) {

  this.shape_ = shape;

  this.dragger_;
};



xrx.shape.Modifiable.prototype.setCoords = goog.abstractMethod;



xrx.shape.Modifiable.prototype.setCoordAt = goog.abstractMethod;



xrx.shape.Modifiable.prototype.move = goog.abstractMethod;



xrx.shape.Modifiable.prototype.getShape = function() {
  return this.shape_;
};



xrx.shape.Modifiable.prototype.getHelper = function() {
  return this.dragger_;
};



xrx.shape.Modifiable.prototype.setDragger = function(dragger) {
  this.dragger_ = dragger;
};

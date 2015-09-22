/**
 * @fileoverview An abstract class representing a modifiable
 *   shape.
 */

goog.provide('xrx.shape.Modifiable');



xrx.shape.Modifiable = function(shape, helper) {

  this.shape_ = shape;

  this.helper_ = helper;
};



xrx.shape.Modifiable.prototype.setCoords = goog.abstractMethod;



xrx.shape.Modifiable.prototype.setCoordAt = goog.abstractMethod;



xrx.shape.Modifiable.prototype.getHelper = function() {
  return this.helper_;
};

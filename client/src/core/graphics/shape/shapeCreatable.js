/**
 * @fileoverview An abstract class representing a creatable
 *   shape.
 */

goog.provide('xrx.shape.Creatable');



xrx.shape.Creatable = function(target, helper) {

  this.target_ = target;

  this.helper_ = helper;

  this.eventHandler_;
};



xrx.shape.Creatable.prototype.setEventHandler = function(handler) {
  this.eventHandler_ = handler;
};



xrx.shape.Creatable.prototype.setFillColor = function(color) {
  this.helper_.setFillColor(color);
};



xrx.shape.Creatable.prototype.setFillOpacity = function(factor) {
  this.helper_.setFillOpacity(factor);
};



xrx.shape.Creatable.prototype.setStrokeColor = function(color) {
  this.helper_.setStrokeColor(color);
};



xrx.shape.Creatable.prototype.setStrokeWidth = function(width) {
  this.helper_.setStrokeWidth(width);
};

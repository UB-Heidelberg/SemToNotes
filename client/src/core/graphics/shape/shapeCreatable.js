/**
 * @fileoverview An abstract class representing a creatable
 *   shape.
 */

goog.provide('xrx.shape.Creatable');



xrx.shape.Creatable = function(target, preview) {

  this.target_ = target;

  this.preview_ = preview;

  this.eventHandler_;
};



xrx.shape.Creatable.prototype.setEventHandler = function(handler) {
  this.eventHandler_ = handler;
};



xrx.shape.Creatable.prototype.setFillColor = function(color) {
  this.preview_.setFillColor(color);
};



xrx.shape.Creatable.prototype.setFillOpacity = function(factor) {
  this.preview_.setFillOpacity(factor);
};



xrx.shape.Creatable.prototype.setStrokeColor = function(color) {
  this.preview_.setStrokeColor(color);
};



xrx.shape.Creatable.prototype.setStrokeWidth = function(width) {
  this.preview_.setStrokeWidth(width);
};

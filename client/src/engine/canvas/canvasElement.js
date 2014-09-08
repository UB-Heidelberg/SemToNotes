/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Element');



goog.require('goog.math.AffineTransform');
goog.require('xrx.canvas');



xrx.canvas.Element = function(element, canvas) {

  this.element_ = element;

  this.canvas_ = canvas;

  this.context_ = canvas.getContext('2d');

  this.transform_ = new goog.math.AffineTransform();
};



xrx.canvas.Element.prototype.getGraphic = function() {
  return this.graphic_;
};



xrx.canvas.Element.prototype.getElement = function() {
  return this.element_;
};



xrx.canvas.Element.prototype.getContext = function() {
  return this.context_;
};



xrx.canvas.Element.prototype.getCanvas = function() {
  return this.canvas_;
};



xrx.canvas.Element.prototype.setWidth = function(width) {
  this.element_.setAttribute('width', width);
};



xrx.canvas.Element.prototype.setHeight = function(height) {
  this.element_.setAttribute('height', height);
};



xrx.canvas.Element.prototype.setAttribute = function(key, value) {
  this[key] = value;
};



xrx.canvas.Element.prototype.setTransform = function(transform) {
  this.transform_ = transform;
};



xrx.canvas.Element.prototype.transform = function() {
  var t = this.transform_;
  this.context_.setTransform(t.m00_, t.m10_, t.m01_, t.m11_, t.m02_, t.m12_);
};

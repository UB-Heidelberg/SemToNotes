***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Element');



goog.require('goog.math.AffineTransform');
goog.require('xrx.canvas');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.canvas.Element = function(element, canvas) {

  this.element_ = element;

  this.canvas_ = canvas;

  this.context_ = canvas.getContext('2d');

  this.transform_ = new goog.math.AffineTransform();
***REMOVED***



xrx.canvas.Element.prototype.getGraphic = function() {
  return this.graphic_;
***REMOVED***



xrx.canvas.Element.prototype.getElement = function() {
  return this.element_;
***REMOVED***



xrx.canvas.Element.prototype.getContext = function() {
  return this.context_;
***REMOVED***



xrx.canvas.Element.prototype.getCanvas = function() {
  return this.canvas_;
***REMOVED***



xrx.canvas.Element.prototype.setWidth = function(width) {
  this.element_.setAttribute('width', width);
***REMOVED***



xrx.canvas.Element.prototype.setHeight = function(height) {
  this.element_.setAttribute('height', height);
***REMOVED***



xrx.canvas.Element.prototype.setAttribute = function(key, value) {
  this[key] = value;
***REMOVED***



xrx.canvas.Element.prototype.setTransform = function(transform) {
  this.transform_ = transform;
***REMOVED***



xrx.canvas.Element.prototype.transform = function() {
  var t = this.transform_;
  this.context_.setTransform(t.m00_, t.m10_, t.m01_, t.m11_, t.m02_, t.m12_);
***REMOVED***

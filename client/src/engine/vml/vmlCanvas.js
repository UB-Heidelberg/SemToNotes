***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.vml.Canvas');



***REMOVED***
goog.require('xrx.vml');
goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.vml.Canvas = function(raphael) {

  goog.base(this, raphael);

  this.width_ = 0;

  this.height_ = 0;
***REMOVED***
goog.inherits(xrx.vml.Canvas, xrx.vml.Element);



xrx.vml.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.getElement(), element.getElement());
  element.draw();
***REMOVED***



xrx.vml.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.raphael_.setSize(this.width_, this.height_);
***REMOVED***



xrx.vml.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.raphael_.setSize(this.width_, this.height_);
***REMOVED***



xrx.vml.Canvas.create = function(parent) {
  var element = goog.dom.createElement('div');
  var raphael = Raphael(element, 0, 0);
  var canvas = new xrx.vml.Canvas(raphael);
  goog.dom.insertChildAt(parent, canvas.getElement(), 0);
  return canvas;
***REMOVED***

***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Canvas');



***REMOVED***
goog.require('xrx.canvas.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.canvas.Canvas = function(element) {

  goog.base(this, element, element);

  this.childs_ = [];
***REMOVED***
goog.inherits(xrx.canvas.Canvas, xrx.canvas.Element);



xrx.canvas.Canvas.tagName = 'canvas';



xrx.canvas.Canvas.prototype.addChild = function(element) {
  this.childs_.push(element);
  element.draw();
***REMOVED***



xrx.canvas.Canvas.create = function(parent) {
  var element = goog.dom.createElement(xrx.canvas.Canvas.tagName);
  var canvas = new xrx.canvas.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
***REMOVED***

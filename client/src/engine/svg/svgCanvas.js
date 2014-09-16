***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Canvas');



***REMOVED***
goog.require('xrx.svg.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg.Canvas = function(element) {

***REMOVED***

  this.width_;

  this.height_;
***REMOVED***
goog.inherits(xrx.svg.Canvas, xrx.svg.Element);



xrx.svg.Canvas.tagName = 'svg';



xrx.svg.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.element_, element.getElement());
  element.draw();
***REMOVED***



xrx.svg.Canvas.create = function(parent) {
  var element = xrx.svg.Element.create(xrx.svg.Canvas);
  var canvas = new xrx.svg.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
***REMOVED***

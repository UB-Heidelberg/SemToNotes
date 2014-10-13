***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Shape');



goog.require('xrx.mvc.ComponentView');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.Shape = function(element, drawing) {

  this.drawing_ = drawing;

***REMOVED***

  this.shape_;
***REMOVED***
goog.inherits(xrx.widget.Shape, xrx.mvc.ComponentView);



xrx.widget.Shape.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.widget.Shape.prototype.getShape = function() {
  return this.shape_;
***REMOVED***

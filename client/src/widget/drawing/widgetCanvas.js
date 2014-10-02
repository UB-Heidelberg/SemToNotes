***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Canvas');



goog.require('xrx');
goog.require('xrx.view');
goog.require('xrx.drawing.Drawing');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.Canvas = function(element) {

***REMOVED***

  this.drawing_;
***REMOVED***
goog.inherits(xrx.widget.Canvas, xrx.view);



xrx.widget.Canvas.prototype.refresh = function() {
***REMOVED***



xrx.widget.Canvas.prototype.createDom = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_);
***REMOVED***

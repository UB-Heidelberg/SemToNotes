***REMOVED***
***REMOVED*** @fileoverview Canvas super class.
***REMOVED***

goog.provide('xrx.canvas.Element');



goog.require('xrx.canvas');



***REMOVED***
***REMOVED*** Canvas super class.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED***
xrx.canvas.Element = function(canvas) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent canvas object.
  ***REMOVED*** @type {xrx.canvas.Canvas}
 ***REMOVED*****REMOVED***
  this.canvas_ = canvas;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The rendering context.
  ***REMOVED*** @type {CanvasRenderingContext2D}
 ***REMOVED*****REMOVED***
  this.context_ = canvas.getElement().getContext('2d');
***REMOVED***



***REMOVED***
***REMOVED*** Returns the parent canvas object.
***REMOVED*** @return {xrx.canvas.Canvas} The parent canvas object.
***REMOVED***
xrx.canvas.Element.prototype.getCanvas = function() {
  return this.canvas_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the HTML canvas rendering context.
***REMOVED*** @return {CanvasRenderingContext2D} The rendering context.
***REMOVED***
xrx.canvas.Element.prototype.getContext = function() {
  return this.context_;
***REMOVED***

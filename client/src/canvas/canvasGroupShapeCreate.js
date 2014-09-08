***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas group where new shapes
***REMOVED*** can be created.
***REMOVED***

goog.provide('xrx.canvas.GroupShapeCreate');



***REMOVED***
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');



***REMOVED***
***REMOVED*** A class representing a canvas group where new shapes can be created.
***REMOVED*** @param {xrx.canvas.Canvas} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Group
***REMOVED***
xrx.canvas.GroupShapeCreate = function(canvas) {

  goog.base(this, canvas);
***REMOVED***
goog.inherits(xrx.canvas.GroupShapeCreate, xrx.canvas.Group);



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.GroupShapeCreate.prototype.registerEvents_ = function() {
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
***REMOVED***

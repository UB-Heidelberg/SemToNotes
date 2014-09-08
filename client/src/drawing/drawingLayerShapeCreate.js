***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas group where new shapes
***REMOVED*** can be created.
***REMOVED***

goog.provide('xrx.drawing.LayerShapeCreate');



***REMOVED***
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');



***REMOVED***
***REMOVED*** A class representing a canvas group where new shapes can be created.
***REMOVED*** @param {xrx.drawing.Drawing} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerShapeCreate = function(canvas) {

  goog.base(this, canvas);
***REMOVED***
goog.inherits(xrx.drawing.LayerShapeCreate, xrx.drawing.Layer);

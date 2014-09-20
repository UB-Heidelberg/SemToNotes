***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas group where shapes can be rendered.
***REMOVED***

goog.provide('xrx.drawing.LayerShape');



***REMOVED***
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.engine.Engine');
goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Rect');



***REMOVED***
***REMOVED*** A class representing a canvas group where shapes can be rendered.
***REMOVED*** @param {xrx.drawing.Drawing} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerShape = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.drawing.LayerShape, xrx.drawing.Layer);



***REMOVED***
***REMOVED*** Updates the coordinates of the shape currently selected by the user.
***REMOVED*** @param {Array.<Array.<number>>} coords The new coordinates.
***REMOVED***
xrx.drawing.LayerShape.prototype.update = function(coords, canvas) {
  var selectedShape = this.getCanvas().getSelectedShape();
  var selectedElement = this.getCanvas().getSelectedElement();

  selectedShape.setCoords(selectedElement, coords, canvas);
***REMOVED***

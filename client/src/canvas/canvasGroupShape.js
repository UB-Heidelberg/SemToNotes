***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas group where shapes can be rendered.
***REMOVED***

goog.provide('xrx.canvas.GroupShape');



***REMOVED***
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');
goog.require('xrx.graphics.Graphics');



***REMOVED***
***REMOVED*** A class representing a canvas group where shapes can be rendered.
***REMOVED*** @param {xrx.canvas.Canvas} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Group
***REMOVED***
xrx.canvas.GroupShape = function(canvas) {

  goog.base(this, canvas);
***REMOVED***
goog.inherits(xrx.canvas.GroupShape, xrx.canvas.Group);



***REMOVED***
***REMOVED*** Updates the coordinates of the shape currently selected by the user.
***REMOVED*** @param {Array.<Array.<number>>} coords The new coordinates.
***REMOVED***
xrx.canvas.GroupShape.prototype.update = function(coords) {
  var selectedShape = this.getCanvas().getSelectedShape();
  var selectedElement = this.getCanvas().getSelectedElement();

  selectedShape.setCoords(selectedElement, coords);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.GroupShape.prototype.registerEvents_ = function() {
  var graphics = this.getCanvas().getGraphics();
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, graphics.Rect);
  this.registerMouseDrag(this.element_, graphics.Polygon);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDelete(this.element_, graphics.Rect);
  this.registerMouseDelete(this.element_, graphics.Polygon);
***REMOVED***

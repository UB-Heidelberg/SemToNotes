***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas layer where shapes
***REMOVED*** can be modified.
***REMOVED***

goog.provide('xrx.drawing.LayerShapeModify');



***REMOVED***
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.VertexDragger');



***REMOVED***
***REMOVED*** A class representing a canvas layer where shapes can be modified.
***REMOVED*** @param {xrx.drawing.Drawing} drawing A drawing object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerShapeModify = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.drawing.LayerShapeModify, xrx.drawing.Layer);



xrx.drawing.LayerShapeModify.prototype.handleMove = function(e) {
***REMOVED***



xrx.drawing.LayerShapeModify.prototype.handleUp = function(e) {
***REMOVED***



***REMOVED***
***REMOVED*** Returns all vertex dragging elements attached to the currently selected shape.
***REMOVED*** @return {Array.<DOMElement>} The vertex dragging elements.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.getVertexDraggers = function() {
  return this.group_.getChildren();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of all vertex dragging elements attached to the currently
***REMOVED*** selected shape.
***REMOVED*** @param {?} opt_vertexDraggers For performance overload the vertex dragging elements  
***REMOVED*** if already known.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.getVertexDraggerCoords = function(opt_vertexDraggers) {
  var graphics = this.getCanvas().getGraphics();
  var vertexDraggers = opt_vertexDraggers || this.getVertexDraggers();
  var length = vertexDraggers.length;
  var coords = new Array(length);
  var coordNew;
  var coordVertex;

  for(var i = 0; i < length; i++) {
    coordNew = new Array(2);
    coordVertex = xrx.shape.VertexDragger.getCoords(vertexDraggers[i]);
    coordNew[0] = coordVertex[0][0];
    coordNew[1] = coordVertex[0][1];
    coords[i] = coordNew;
  }

  return coords;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the position of the vertex dragging element currently used for dragging.
***REMOVED*** @param {DOMElement} element The vertex dragging element to test.
***REMOVED*** @param {?} opt_vertexDraggers For performance overload the vertex dragging elements
***REMOVED*** if already known.
***REMOVED*** @return {number} The position.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.getVertexDraggerPosition = function(element, opt_vertexDraggers) {
  var pos;
  var vertexDraggers = opt_vertexDraggers || this.getVertexDraggers();

  for(var i = 0; i < vertexDraggers.length; i++) {
    pos = i;
    if (vertexDraggers[i] === element) break;
  }

  return pos;
***REMOVED***



***REMOVED***
***REMOVED*** Add vertex dragging elements for shape modification.
***REMOVED*** @param {?} modifiers ???
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.activate = function(modifiers) {
  this.removeShapes();
  this.addShapes(modifiers);
  this.getDrawing().draw();
***REMOVED***



***REMOVED***
***REMOVED*** Updates the coordinates of the vertex dragging element currently selected.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED*** @param {number} position The position of the vertex dragging element which
***REMOVED*** shall not be updated.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.update = function(coords, position) {
  var vertexDraggers = this.getVertexDraggers();

  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) vertexDraggers[d].setCenter(coords[d][0], coords[d][1]);
  }
***REMOVED***

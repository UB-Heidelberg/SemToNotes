***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas group where shapes
***REMOVED*** can be modified.
***REMOVED***

goog.provide('xrx.canvas.GroupShapeModify');



***REMOVED***
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');
goog.require('xrx.graphics.Graphics');



***REMOVED***
***REMOVED*** A class representing a canvas group where shapes can be modified.
***REMOVED*** @param {xrx.canvas.Canvas} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Group
***REMOVED***
xrx.canvas.GroupShapeModify = function(canvas) {

  goog.base(this, canvas);
***REMOVED***
goog.inherits(xrx.canvas.GroupShapeModify, xrx.canvas.Group);



***REMOVED***
***REMOVED*** Returns all vertex dragging elements attached to the currently selected shape.
***REMOVED*** @return {Array.<DOMElement>} The vertex dragging elements.
***REMOVED***
xrx.canvas.GroupShapeModify.prototype.getVertexDraggers = function() {
***REMOVED***
  return goog.dom.getChildren(self.getShapeWrapper());
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of all vertex dragging elements attached to the currently
***REMOVED*** selected shape.
***REMOVED*** @param {?} opt_vertexDraggers For performance overload the vertex dragging elements
***REMOVED*** if already known.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.canvas.GroupShapeModify.prototype.getVertexDraggerCoords = function(opt_vertexDraggers) {
  var graphics = this.getCanvas().getGraphics();
  var vertexDraggers = opt_vertexDraggers || this.getVertexDraggers();
  var length = vertexDraggers.length;
  var coords = new Array(length);
  var coordNew;
  var coordVertex;

  for(var i = 0; i < length; i++) {
    coordNew = new Array(2);
    coordVertex = graphics.VertexDragger.getCoords(vertexDraggers[i]);
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
xrx.canvas.GroupShapeModify.prototype.getVertexDraggerPosition = function(element, opt_vertexDraggers) {
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
***REMOVED*** @param {DOMElement} modifiable A group element containing vertex dragging elements.
***REMOVED***
xrx.canvas.GroupShapeModify.prototype.activate = function(modifiable) {
***REMOVED***
  goog.dom.replaceNode(modifiable, self.getShapeWrapper());
  this.shapeWrapper_ = modifiable;
***REMOVED***



***REMOVED***
***REMOVED*** Updates the coordinates of the vertex dragging element currently selected.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED*** @param {number} position The position of the vertex dragging element which
***REMOVED*** shall not be updated.
***REMOVED***
xrx.canvas.GroupShapeModify.prototype.update = function(coords, position) {
  var graphics = this.getCanvas().getGraphics();
  var vertexDraggers = this.getVertexDraggers();

  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) graphics.VertexDragger.setCoords(vertexDraggers[d], [coords[d]]);
  }
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.GroupShapeModify.prototype.registerEvents_ = function() {
  var graphics = this.getCanvas().getGraphics();
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, graphics.VertexDragger);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
***REMOVED***


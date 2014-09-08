/**
 * @fileoverview A class representing a canvas group where shapes
 * can be modified.
 */

goog.provide('xrx.canvas.GroupShapeModify');



goog.require('goog.dom.DomHelper');
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');
goog.require('xrx.graphics.Graphics');



/**
 * A class representing a canvas group where shapes can be modified.
 * @param {xrx.canvas.Canvas} canvas A canvas object.
 * @constructor
 * @extends xrx.canvas.Group
 */
xrx.canvas.GroupShapeModify = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.GroupShapeModify, xrx.canvas.Group);



/**
 * Returns all vertex dragging elements attached to the currently selected shape.
 * @return {Array.<DOMElement>} The vertex dragging elements.
 */
xrx.canvas.GroupShapeModify.prototype.getVertexDraggers = function() {
  var self = this;
  return goog.dom.getChildren(self.getShapeWrapper());
};



/**
 * Returns the coordinates of all vertex dragging elements attached to the currently
 * selected shape.
 * @param {?} opt_vertexDraggers For performance overload the vertex dragging elements
 * if already known.
 * @return {Array.<Array.<number>>} The coordinates.
 */
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
};



/**
 * Returns the position of the vertex dragging element currently used for dragging.
 * @param {DOMElement} element The vertex dragging element to test.
 * @param {?} opt_vertexDraggers For performance overload the vertex dragging elements
 * if already known.
 * @return {number} The position.
 */
xrx.canvas.GroupShapeModify.prototype.getVertexDraggerPosition = function(element, opt_vertexDraggers) {
  var pos;
  var vertexDraggers = opt_vertexDraggers || this.getVertexDraggers();

  for(var i = 0; i < vertexDraggers.length; i++) {
    pos = i;
    if (vertexDraggers[i] === element) break;
  }

  return pos;
};



/**
 * Add vertex dragging elements for shape modification.
 * @param {DOMElement} modifiable A group element containing vertex dragging elements.
 */
xrx.canvas.GroupShapeModify.prototype.activate = function(modifiable) {
  var self = this;
  goog.dom.replaceNode(modifiable, self.getShapeWrapper());
  this.shapeWrapper_ = modifiable;
};



/**
 * Updates the coordinates of the vertex dragging element currently selected.
 * @param {Array.<Array.<number>>} coords The coordinates.
 * @param {number} position The position of the vertex dragging element which
 * shall not be updated.
 */
xrx.canvas.GroupShapeModify.prototype.update = function(coords, position) {
  var graphics = this.getCanvas().getGraphics();
  var vertexDraggers = this.getVertexDraggers();

  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) graphics.VertexDragger.setCoords(vertexDraggers[d], [coords[d]]);
  }
};



/**
 * @private
 */
xrx.canvas.GroupShapeModify.prototype.registerEvents_ = function() {
  var graphics = this.getCanvas().getGraphics();
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, graphics.VertexDragger);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
};


/**
 * @fileoverview A class representing a canvas layer where shapes
 * can be modified.
 */

goog.provide('xrx.drawing.LayerShapeModify');



goog.require('goog.dom.DomHelper');
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing a canvas layer where shapes can be modified.
 * @param {xrx.drawing.Drawing} drawing A drawing object.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerShapeModify = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.drawing.LayerShapeModify, xrx.drawing.Layer);



xrx.drawing.LayerShapeModify.prototype.handleMove = function(e) {
};



xrx.drawing.LayerShapeModify.prototype.handleUp = function(e) {
};



/**
 * Returns all vertex dragging elements attached to the currently selected shape.
 * @return {Array.<DOMElement>} The vertex dragging elements.
 */
xrx.drawing.LayerShapeModify.prototype.getVertexDraggers = function() {
  return this.group_.getChildren();
};



/**
 * Returns the coordinates of all vertex dragging elements attached to the currently
 * selected shape.
 * @param {?} opt_vertexDraggers For performance overload the vertex dragging elements  
 * if already known.
 * @return {Array.<Array.<number>>} The coordinates.
 */
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
};



/**
 * Returns the position of the vertex dragging element currently used for dragging.
 * @param {DOMElement} element The vertex dragging element to test.
 * @param {?} opt_vertexDraggers For performance overload the vertex dragging elements
 * if already known.
 * @return {number} The position.
 */
xrx.drawing.LayerShapeModify.prototype.getVertexDraggerPosition = function(element, opt_vertexDraggers) {
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
 * @param {?} modifiers ???
 */
xrx.drawing.LayerShapeModify.prototype.activate = function(modifiers) {
  this.removeShapes();
  this.addShapes(modifiers);
  this.getDrawing().draw();
};



/**
 * Updates the coordinates of the vertex dragging element currently selected.
 * @param {Array.<Array.<number>>} coords The coordinates.
 * @param {number} position The position of the vertex dragging element which
 * shall not be updated.
 */
xrx.drawing.LayerShapeModify.prototype.update = function(coords, position) {
  var vertexDraggers = this.getVertexDraggers();

  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) vertexDraggers[d].setCenter(coords[d][0], coords[d][1]);
  }
};

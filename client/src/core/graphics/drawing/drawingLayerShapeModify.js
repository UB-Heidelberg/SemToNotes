/**
 * @fileoverview A class representing a drawing layer where shapes
 * can be modified.
 */

goog.provide('xrx.drawing.LayerShapeModify');



goog.require('xrx.drawing.Layer');



/**
 * A class representing a drawing layer where shapes can be modified.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerShapeModify = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.drawing.LayerShapeModify, xrx.drawing.Layer);



/**
 * @private
 */
xrx.drawing.LayerShapeModify.prototype.getVertexDraggers_ = function() {
  return this.group_.getChildren();
};



/**
 * Add modifiers such as vertex dragging elements to this layer.
 * @param {Array<xrx.shape.Shape>} modifiers The modifier elements.
 */
xrx.drawing.LayerShapeModify.prototype.activate = function(modifiers) {
  this.removeShapes();
  this.addShapes(modifiers);
  this.getDrawing().draw();
};



/**
 * Updates the coordinates of the vertex dragging element currently selected.
 * @param {Array<Array<number>>} coords The coordinates.
 * @param {number} position The position of the modifier element, which
 * is not updated but all others.
 */
xrx.drawing.LayerShapeModify.prototype.update = function(coords, position) {
  var vertexDraggers = this.getVertexDraggers_();
  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) vertexDraggers[d].setCenter(coords[d][0], coords[d][1]);
  }
};

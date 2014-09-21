***REMOVED***
***REMOVED*** @fileoverview A class representing a drawing layer where shapes
***REMOVED*** can be modified.
***REMOVED***

goog.provide('xrx.drawing.LayerShapeModify');



goog.require('xrx.drawing.Layer');



***REMOVED***
***REMOVED*** A class representing a drawing layer where shapes can be modified.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerShapeModify = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.drawing.LayerShapeModify, xrx.drawing.Layer);



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.getVertexDraggers_ = function() {
  return this.group_.getChildren();
***REMOVED***



***REMOVED***
***REMOVED*** Add modifiers such as vertex dragging elements for shape modification to the
***REMOVED*** layer.
***REMOVED*** @param {Object} modifiers The modifier elements.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.activate = function(modifiers) {
  this.removeShapes();
  this.addShapes(modifiers);
  this.getDrawing().draw();
***REMOVED***



***REMOVED***
***REMOVED*** Updates the coordinates of the vertex dragging element currently selected.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED*** @param {number} position The position of the modifier element, which
***REMOVED*** is not updated but all others.
***REMOVED***
xrx.drawing.LayerShapeModify.prototype.update = function(coords, position) {
  var vertexDraggers = this.getVertexDraggers_();

  for(var d = 0, len = vertexDraggers.length; d < len; d++) {
    if (d != position) vertexDraggers[d].setCenter(coords[d][0], coords[d][1]);
  }
***REMOVED***

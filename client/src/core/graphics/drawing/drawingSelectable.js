/**
 * @fileoverview A class representing a selectable shape.
 */

goog.provide('xrx.drawing.Selectable');



/**
 * @constructor
 */
xrx.drawing.Selectable = function(drawing) {

  this.drawing_ = drawing;
};



xrx.drawing.Selectable.prototype.handleClick = function(e) {
  var mousePoint = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(mousePoint);
  if (shape && shape.handleSelected) shape.handleSelected();
};

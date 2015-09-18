/**
 * @fileoverview A class representing a selectable shape.
 */

goog.provide('xrx.drawing.Selectable');



/**
 * A class representing a selectable shape.
 * @constructor
 */
xrx.drawing.Selectable = function(drawing) {

  /**
   * The parent drawing canvas.
   * @type {xrx.drawing.Drawing}
   */
  this.drawing_ = drawing;
};



/**
 * Handles click events for this selectable shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Selectable.prototype.handleClick = function(e) {
  var mousePoint = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(mousePoint);
  if (shape && shape.handleSelected) shape.handleSelected();
};

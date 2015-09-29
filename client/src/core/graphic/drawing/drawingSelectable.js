/**
 * @fileoverview A class representing a pointer to the shape
 * currently selected by the user.
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

  this.last_;
};



/**
 * Handles down events for this selectable shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Selectable.prototype.handleDown = function(e, cursor) {
  var shape = cursor.getShape();
  if (this.last_) this.last_.getSelectable().selectOff();
  shape.getSelectable().selectOn();
  this.last_ = shape;
};

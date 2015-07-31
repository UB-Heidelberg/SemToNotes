/**
 * @fileoverview A class representing a hoverable shape.
 */

goog.provide('xrx.drawing.Hoverable');



goog.require('xrx.drawing.EventType');
goog.require('xrx.engine');
goog.require('xrx.engine.Stylable');
goog.require('xrx.EventTarget');



/**
 * A class representing a hoverable shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.drawing.Hoverable = function(drawing) {

  goog.base(this);

  /**
   * The drawing canvas.
   */
  this.drawing_ = drawing;

  /**
   * Reference to the last shape hovered.
   * @type {?}
   * @private
   */
  this.last_ = null;

  /**
   * The style of the lastly hovered shape.
   * @type {xrx.engine.Stylable}
   * @private
   */
  this.stylable_ = new xrx.engine.Stylable();
};
goog.inherits(xrx.drawing.Hoverable, xrx.EventTarget);



/**
 * @private
 */
xrx.drawing.Hoverable.prototype.pop_ = function() {
  if (this.last_) {
    this.last_.getEngineShape().setStylable(this.stylable_);
    this.dispatchExternal(xrx.drawing.EventType.SHAPE_HOVER_OUT,
        this.drawing_, this.last_);
  };
};



/**
 * @private
 */
xrx.drawing.Hoverable.prototype.push_ = function(shape) {
  if (shape) {
    this.stylable_.setAll(shape.getEngineShape().getStylable());
    this.last_ = shape;
    this.dispatchExternal(xrx.drawing.EventType.SHAPE_HOVER_IN,
        this.drawing_, shape);
  } else {
    this.last_ = null;
  }
};



/**
 * @private
 */
xrx.drawing.Hoverable.prototype.hover_ = function(shape) {
  if (shape !== this.last_) {
    // reset the style of the shape lastly hovered
    this.pop_();
    // cache the style of the shape currently hovered
    this.push_(shape);
  }
  if (shape) this.dispatchExternal(xrx.drawing.EventType.SHAPE_HOVER_MOVE,
      this.drawing_, shape);
};



/**
 * Function handles mouse move event.
 */
xrx.drawing.Hoverable.prototype.handleMove = function(e) {
  var mousePoint = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(mousePoint);
  this.hover_(shape);
};



/**
 * Function handles mouse out event.
 */
xrx.drawing.Hoverable.prototype.handleOut = function(e) {
  this.pop_();
};

/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.viewbox.Viewbox');



goog.require('xrx.drawing');
goog.require('xrx.drawing.FastAffineTransform');
goog.require('xrx.viewbox.ViewboxTransform');
goog.require('xrx.shape.Group');



/**
 * A class representing the view-box of a drawing canvas.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.viewbox.Viewbox = function(drawing) {

  goog.base(this);

  /**
   * The parent drawing object.
   * @type {xrx.drawing.Drawing}
   */
  this.drawing_ = drawing;

  /**
   * The group where matrix transformations are applied to.
   * {xrx.shape.Group}
   */
  this.group_;

  /**
   * The state of the drawing canvas, either DRAG or NONE.
   * @type {number}
   */
  this.state_ = xrx.drawing.State.NONE;

  /**
   * The last mouse point. This member is used when dragging
   * or panning the view-box.
   * @type {Array<number>}
   */
  this.origin_;

  this.create_();
};
goog.inherits(xrx.viewbox.Viewbox, xrx.viewbox.ViewboxTransform);



/**
 * Returns the parent drawing object of the view-box.
 * @return {xrx.drawing.Drawing} The drawing object.
 */
xrx.viewbox.Viewbox.prototype.getDrawing = function() {
  return this.drawing_;
};



/**
 * Returns the group of the view-box.
 * @return {xrx.shape.Group} The group.
 */
xrx.viewbox.Viewbox.prototype.getGroup = function() {
  return this.group_;
};



/**
 * Handles double-click events for the view-box.
 * @param {Array<number>} offsetPoint The offset point.
 */
xrx.viewbox.Viewbox.prototype.handleDblClick = function(e, offsetPoint) {
  this.rotateRight(offsetPoint);
};



/**
 * Handles mouse-down events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {Array<number>} offsetPoint The offset point.
 */
xrx.viewbox.Viewbox.prototype.handleDown = function(e, offsetPoint) {
  this.origin_ = offsetPoint;
  this.state_ = xrx.drawing.State.DRAG;
};



/**
 * Handles mouse-move events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {Array<number>} offsetPoint The offset point.
 */
xrx.viewbox.Viewbox.prototype.handleMove = function(e, offsetPoint) {
  if (this.state_ !== xrx.drawing.State.DRAG) return;
  var distX = offsetPoint[0] - this.origin_[0];
  var distY = offsetPoint[1] - this.origin_[1];
  this.translate(distX, distY);
  this.origin_ = offsetPoint;
};



/**
 * Handles mouse-out events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.viewbox.Viewbox.prototype.handleOut = function(e) {
  this.resetState_();
};



/**
 * Handles mouse-up events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.viewbox.Viewbox.prototype.handleUp = function(e) {
  this.resetState_();
};



/**
 * Handles mouse-wheel events for the view-box.
 * @param {Array<number>} offsetPoint The offset point.
 */
xrx.viewbox.Viewbox.prototype.handleWheel = function(e, offsetPoint) {
  e.deltaY < 0 ? this.zoomIn(offsetPoint) :
      this.zoomOut(offsetPoint);
};



/**
 * @private
 */
xrx.viewbox.Viewbox.prototype.resetState_ = function() {
  this.state_ = xrx.drawing.State.NONE;
  this.origin_ = null;
};



/**
 * @private
 */
xrx.viewbox.Viewbox.prototype.create_ = function() {
  this.group_ = xrx.shape.Group.create(this.drawing_.getCanvas());
};

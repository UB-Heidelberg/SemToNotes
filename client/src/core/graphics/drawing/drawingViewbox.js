/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('xrx.drawing');
goog.require('xrx.drawing.FastAffineTransform');
goog.require('xrx.drawing.ViewboxTransform');
goog.require('xrx.shape.Group');



/**
 * A class representing the view-box of a drawing canvas.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.drawing.Viewbox = function(drawing) {

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
goog.inherits(xrx.drawing.Viewbox, xrx.drawing.ViewboxTransform);



/**
 * Returns the parent drawing object of the view-box.
 * @return {xrx.drawing.Drawing} The drawing object.
 */
xrx.drawing.Viewbox.prototype.getDrawing = function() {
  return this.drawing_;
};



/**
 * Returns the group of the view-box.
 * @return {Object} The group.
 */
xrx.drawing.Viewbox.prototype.getGroup = function() {
  return this.group_;
};



/**
 * Handles double-click events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDblClick = function(e) {
  this.rotateRight([e.offsetX, e.offsetY]);
};



/**
 * Handles mouse-down events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDown = function(e) {
  var eventPoint = [e.clientX, e.clientY];
  var identity = this.ctm_.getIdentity();
  if (!this.origin_) this.origin_ = new Array(2);
  identity.transformPoint(eventPoint, this.origin_);
  this.state_ = xrx.drawing.State.DRAG;
};



/**
 * Handles mouse-move events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleMove = function(e) {
  if (this.state_ !== xrx.drawing.State.DRAG) return;
  var x = e.clientX - this.origin_[0];
  var y = e.clientY - this.origin_[1];
  this.translate(x, y);
  this.origin_ = [e.clientX, e.clientY];
};



/**
 * Handles mouse-out events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleOut = function(e) {
  this.resetState_();
};



/**
 * Handles mouse-up events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleUp = function(e) {
  this.state_ = xrx.drawing.State.NONE;
};



/**
 * Handles mouse-wheel events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleWheel = function(e) {
  e.deltaY < 0 ? this.zoomIn([e.offsetX, e.offsetY]) :
      this.zoomOut([e.offsetX, e.offsetY]);
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.resetState_ = function() {
  this.state_ = xrx.drawing.State.NONE;
  this.origin_ = null;
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.create_ = function() {
  this.group_ = xrx.shape.Group.create(this.drawing_);
};

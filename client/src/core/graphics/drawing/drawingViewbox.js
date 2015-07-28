/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('xrx.drawing');
goog.require('xrx.drawing.ViewboxTransform');



/**
 * A class representing the view-box of a drawing canvas.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.drawing.Viewbox = function(drawing) {

  this.drawing_ = drawing;

  this.group_;

  this.state_ = xrx.drawing.State.NONE;

  this.origin_;

  this.create_();

  goog.base(this);
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
 * @private
 */
xrx.drawing.Viewbox.prototype.resetState_ = function() {
  this.state_ = xrx.drawing.State.NONE;
  this.origin_ = null;
};



/**
 * Handles double-click events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDblClick = function(e) {
  this.rotateRight();
};



/**
 * Handles mouse-down events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDown = function(e) {
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  if (!this.origin_) this.origin_ = new Array(2);

  transform.createInverse().transform(eventPoint, 0, this.origin_, 0, 1);

  this.state_ = xrx.drawing.State.DRAG;
};



/**
 * Handles mouse-move events for the view-box.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleMove = function(e) {
  if (this.state_ !== xrx.drawing.State.DRAG) return;

  var point = new Array(2);
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  transform.createInverse().transform(eventPoint, 0, point, 0, 1);

  var x = point[0] - this.origin_[0];
  var y = point[1] - this.origin_[1];

  this.ctm_ = transform.translate(x, y).concatenate(this.ctm_);

  this.origin_ = point;

  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange(); 
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
xrx.drawing.Viewbox.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};

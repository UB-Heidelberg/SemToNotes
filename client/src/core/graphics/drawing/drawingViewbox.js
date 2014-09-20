/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('xrx.drawing');
goog.require('xrx.engine');



/**
 * @constructor
 */
xrx.drawing.Viewbox = function(drawing) {

  this.drawing_ = drawing;

  this.group_;

  this.ctm_ = new goog.math.AffineTransform();

  this.state_ = xrx.drawing.State.NONE;

  this.origin_;

  this.create_();
};



xrx.drawing.Viewbox.prototype.getDrawing = function() {
  return this.drawing_;
};



xrx.drawing.Viewbox.prototype.getGroup = function() {
  return this.group_;
};



xrx.drawing.Viewbox.prototype.getCTM = function() {
  return this.ctm_;
};



xrx.drawing.Viewbox.prototype.getBox = function() {
  var image = this.drawing_.getLayerBackground().getImage();
  return image.getGeometry().getBox();
};



/**
 * Double click event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleDblClick = function(e) {
  this.rotateRight();
};



/**
 * Mouse down event handler.
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
 * Mouse move event handler.
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
};



xrx.drawing.Viewbox.prototype.handleOut = function(e) {
  this.resetState_();
};



/**
 * Mouse up event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.drawing.Viewbox.prototype.handleUp = function(e) {
  this.state_ = xrx.drawing.State.NONE;
};



/**
 * Mouse-wheel event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.drawing.Drawing} canvas The canvas object.
 */
xrx.drawing.Viewbox.prototype.handleZoom = function(e) {
  e.deltaY < 0 ? this.zoomIn() : this.zoomOut();
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
xrx.drawing.Viewbox.prototype.getCenterPoint_ = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  return [image.getWidth() / 2, image.getHeight() / 2];
};



/**
 * Rotates the view-box by 90° in left direction.
 */
xrx.drawing.Viewbox.prototype.rotateLeft = function() {
  var centerPoint = this.getCenterPoint_();
  this.ctm_.rotate(goog.math.toRadians(-90), centerPoint[0],
      centerPoint[1]);
};



/**
 * Rotates the view-box by 90° in right direction.
 */
xrx.drawing.Viewbox.prototype.rotateRight = function() {
  var centerPoint = this.getCenterPoint_();
  this.ctm_.rotate(goog.math.toRadians(90), centerPoint[0],
      centerPoint[1]);
};



/**
 * Zoom in on the view-box.
 */
xrx.drawing.Viewbox.prototype.zoomIn = function() {
  this.ctm_.scale(1.05, 1.05);
};



/**
 * Zoom out the view-box.
 */
xrx.drawing.Viewbox.prototype.zoomOut = function() {
  this.ctm_.scale(.95, .95);
};



/**
 * @private
 */
xrx.drawing.Viewbox.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};

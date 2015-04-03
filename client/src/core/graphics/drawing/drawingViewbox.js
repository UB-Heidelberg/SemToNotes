/**
 * @fileoverview A class representing the view-box of a drawing canvas.
 */

goog.provide('xrx.drawing.Viewbox');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');
goog.require('xrx.drawing');



/**
 * A class representing the view-box of a drawing canvas.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
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



/**
 * Makes the whole view-box width visible.
 */
xrx.drawing.Viewbox.prototype.setOptimalWidth = function() {
  var canvasWidth = this.drawing_.getCanvas().getWidth();
  var imageWidth = this.drawing_.getLayerBackground().getImage().getWidth();
  var scale = canvasWidth / imageWidth;
  this.ctm_.scale(scale, scale);
};



/**
 * Makes the whole view-box height visible.
 */
xrx.drawing.Viewbox.prototype.setOptimalHeight = function() {
  var canvasHeight = this.drawing_.getCanvas().getHeight();
  var imageHeight = this.drawing_.getLayerBackground().getImage().getHeight();
  var scale = canvasHeight / imageHeight;
  this.ctm_.scale(scale, scale);
};



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
 * Returns the current transformation matrix of the view-box.
 * @return {goog.math.affineTransform} The transformation matrix.
 */
xrx.drawing.Viewbox.prototype.getCTM = function() {
  return this.ctm_;
};



/**
 * Returns a dump of the current CTM as an array.
 * @return Array.<number> The number array.
 */
xrx.drawing.Viewbox.prototype.ctmDump = function() {
  return [this.ctm_.m00_, this.ctm_.m10_, this.ctm_.m01_,
      this.ctm_.m11_, this.ctm_.m02_, this.ctm_.m12_];
};



/**
 * Restores a CTM from an array.
 * @param Array.<number> dump The number array.
 */
xrx.drawing.Viewbox.prototype.ctmRestore = function(dump) {
  if (dump.length !== 6) throw Error('Invalid CTM dump.');
  this.ctm_.setTransform(dump[0], dump[1], dump[2], dump[3],
      dump[4], dump[5]);
};



/**
 * Returns the bounding-box for the view-box.
 * @return {goog.math.Box} The bounding box.
 */
xrx.drawing.Viewbox.prototype.getBox = function() {
  var image = this.drawing_.getLayerBackground().getImage();
  return image.getGeometry().getBox();
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

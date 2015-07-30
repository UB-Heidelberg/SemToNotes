/**
 * @fileoverview A class implementing transformation functions for
 * a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxTransform');



goog.require('xrx.drawing.FastAffineTransform');
goog.require('xrx.drawing.Orientation');
goog.require('xrx.drawing.ViewboxTranslate');



/**
 * @fileoverview A class implementing transformation functions for
 * a drawing view-box.
 * @constructor
 */
xrx.drawing.ViewboxTransform = function() {

  this.ctm_ = new xrx.drawing.FastAffineTransform();

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxTransform, xrx.drawing.ViewboxTranslate);



/**
 * Returns the current transformation matrix of the view-box.
 * @return {xrx.drawing.FastAffineTransform} The transformation matrix.
 */
xrx.drawing.ViewboxTransform.prototype.getCTM = function() {
  return this.ctm_;
};



/**
 * Sets the current transformation matrix of the view-box.
 * @param {xrx.drawing.FastAffineTransform} ctm The matrix object.
 */
xrx.drawing.ViewboxTransform.prototype.setCTM = function(ctm) {
  this.ctm_ = ctm;
};



/**
 * Returns a dump of the current transformation matrix as an array.
 * @return Array<number> The number array.
 */
xrx.drawing.ViewboxTransform.prototype.ctmDump = function() {
  return [this.ctm_.m00_, this.ctm_.m10_, this.ctm_.m01_,
      this.ctm_.m11_, this.ctm_.m02_, this.ctm_.m12_];
};



/**
 * Restores the current transformation matrix from an array.
 * @param Array<number> dump The number array.
 */
xrx.drawing.ViewboxTransform.prototype.ctmRestore = function(dump) {
  if (dump.length !== 6) throw Error('Invalid CTM dump.');
  this.ctm_.setTransform(dump[0], dump[1], dump[2], dump[3],
      dump[4], dump[5]);
};



/**
 * Makes the view-box equally wide to the drawing canvas.
 */
xrx.drawing.ViewboxTransform.prototype.fitToWidth = function() {
  var viewboxWidth = this.getWidth(true, true);
	var canvasWidth = this.drawing_.getCanvas().getWidth();
  var scale = canvasWidth / viewboxWidth;
  this.ctm_.scale(scale, scale);
  this.dispatchExternal(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};



/**
 * Makes the view-box equally high to the drawing canvas.
 */
xrx.drawing.ViewboxTransform.prototype.fitToHeight = function() {
  var viewboxHeight = this.getHeight(true, true);
	var canvasHeight = this.drawing_.getCanvas().getHeight();
  var scale = canvasHeight / viewboxHeight;
  this.ctm_.scale(scale, scale);
  this.dispatchExternal(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};



/**
 * Makes the view-box size such that it fits into the drawing
 * canvas and optionally centers the view-box.
 * @param {?boolean} opt_center Whether also center the canvas.
 */
xrx.drawing.ViewboxTransform.prototype.fit = function(opt_center) {
  var width = this.getWidth(true, true);
  var height = this.getHeight(true, true);
  width > height ? this.fitToWidth() : this.fitToHeight();
  if (opt_center === true) this.center();
};

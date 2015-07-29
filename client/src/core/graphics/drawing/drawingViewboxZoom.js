/**
 * @fileoverview A class implementing a zooming model for
 * the drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxZoom');



goog.require('xrx.drawing.ViewboxRotate');



/**
 * A class implementing a zooming model for the drawing view-box.
 * @constructor
 */
xrx.drawing.ViewboxZoom = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxZoom, xrx.drawing.ViewboxRotate);



/**
 * The current zoom factor, defaults to .1.
 * @type {number}
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomFactor_ = .1;



/**
 * Returns the current zoom factor.
 * @return {number} The zoom factor.
 */
xrx.drawing.ViewboxZoom.prototype.getZoomFactor = function() {
  return this.zoomFactor_;
};



/**
 * Sets a new zoom factor.
 * @param {number} factor The new zoom factor.
 */
xrx.drawing.ViewboxZoom.prototype.setZoomFactor = function(factor) {
  this.zoomFactor_ = factor;
};



/**
 * Returns the current zoom value.
 * @return {number}
 */
xrx.drawing.ViewboxZoom.prototype.getZoomValue = function(opt_zoomStep) {
  if (opt_zoomStep === undefined) {
    return this.ctm_.getZoomValue();
  } else {
    return this.zoomMin_ + opt_zoomStep * this.zoomFactor_;
  }
};



/**
 * The minimum zoom value.
 * @type {number}
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomMin_ = .1;



/**
 * Returns the current minimum zoom value.
 * @return {number} The minimum zoom value.
 */
xrx.drawing.ViewboxZoom.prototype.getZoomMin = function() {
  return this.zoomMin_;
};



/**
 * Sets the minimum zoom value.
 * @param {number} The minimum zoom value.
 */
xrx.drawing.ViewboxZoom.prototype.setZoomMin = function(value) {
  this.zoomMin_ = value;
};



/**
 * The maximum zoom value.
 * @type {number}
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomMax_ = 4;



/**
 * Returns the current maximum zoom value.
 * @return {number} The maximum zoom value.
 */
xrx.drawing.ViewboxZoom.prototype.getZoomMax = function() {
  return this.zoomMax_;
};



/**
 * Sets the maximum zoom value.
 * @param {number} The maximum zoom value.
 */
xrx.drawing.ViewboxZoom.prototype.setZoomMax = function(value) {
  this.zoomMax_ = value;
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomStep = function(opt_zoomValue) {
  var value = opt_zoomValue !== undefined ? opt_zoomValue : this.getZoomValue();
  return Math.round((value - this.zoomMin_) / this.zoomFactor_);
};



/**
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomOffset_ = function(point, zoomValue) {
  this.ctm_.setTransform(
    this.ctm_.getScaleX(), this.ctm_.getShearY(), 
    this.ctm_.getShearX(), this.ctm_.getScaleY(),
    (this.ctm_.getTranslateX() - point[0]) * zoomValue + point[0],
    (this.ctm_.getTranslateY() - point[1]) * zoomValue + point[1]
  );
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.zoomTo = function(zoomValue, opt_fixPoint) {
  var fixPoint;
  if (opt_fixPoint !== undefined) {
    if (!this.containsPoint(opt_fixPoint)) {
      fixPoint = this.getCenterPoint_(true);
    } else {
      fixPoint = opt_fixPoint;
    }
  } else {
    fixPoint = this.getCenterPoint_(true);
  }
	if(zoomValue < this.zoomMin_) zoomValue = this.zoomMin_;
	if(zoomValue > this.zoomMax_) zoomValue = this.zoomMax_;

  var scale = 1 / this.getZoomValue() * zoomValue;
	this.zoomOffset_(fixPoint, scale);
	this.ctm_.scale(scale, scale);

  this.dispatchEvent(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};



/**
 * Zoom in on the view-box, optionally respecting a fix-point.
 * @param {?Array<number>} opt_fixPoint A fix-point, defaults to the
 * center of the view-box.
 */
xrx.drawing.ViewboxZoom.prototype.zoomIn = function(opt_fixPoint) {
  this.zoomTo(this.getZoomValue() + this.zoomFactor_, opt_fixPoint);
};



/**
 * Zoom out the view-box, optionally respecting a fix-point.
 * @param {?Array<number>} opt_fixPoint A fix-point, defaults to the
 * center of the view-box.
 */
xrx.drawing.ViewboxZoom.prototype.zoomOut = function(opt_fixPoint) {
  this.zoomTo(this.getZoomValue() - this.zoomFactor_, opt_fixPoint);
};

/**
 * @fileoverview A class implementing the zooming model for
 * a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxZoom');



goog.require('xrx.drawing.ViewboxRotate');



xrx.drawing.ViewboxZoom = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxZoom, xrx.drawing.ViewboxRotate);



/**
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomFactor_ = .1;



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomFactor = function() {
  return this.zoomFactor_;
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.setZoomFactor = function(factor) {
  this.zoomFactor_ = factor;
};



/**
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomValue_ = 1;



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomValue = function(opt_zoomStep) {
  if (opt_zoomStep === undefined) {
    return this.zoomValue_;
  } else {
    return this.zoomMin_ + opt_zoomStep * this.zoomFactor_;
  }
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.setZoomValue = function(value) {
  this.zoomValue_ = value;
};



/**
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomMin_ = .1;



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomMin = function() {
  return this.zoomMin_;
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.setZoomMin = function(value) {
  this.zoomMin_ = value;
};



/**
 * @private
 */
xrx.drawing.ViewboxZoom.prototype.zoomMax_ = 4;



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomMax = function() {
  return this.zoomMax_;
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.setZoomMax = function(value) {
  this.zoomMax_ = value;
};



/**
 * 
 */
xrx.drawing.ViewboxZoom.prototype.getZoomStep = function(opt_zoomValue) {
  var value = opt_zoomValue !== undefined ? opt_zoomValue : this.zoomValue_;
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
	if(zoomValue === this.zoomValue_) return;

  var fixPoint = opt_fixPoint ? opt_fixPoint : this.getCenterPoint_(true);
	if(zoomValue < this.zoomMin_) zoomValue = this.zoomMin_;
	if(zoomValue > this.zoomMax_) zoomValue = this.zoomMax_;

  var scale = 1 / this.zoomValue_ * zoomValue;
	this.zoomOffset_(fixPoint, scale);
	this.ctm_.scale(scale, scale);

  this.zoomValue_ = zoomValue;
  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange();
};



/**
 * Zoom in on the view-box, optionally respecting a fix-point.
 * @param {?Array.<number>} opt_fixPoint A fix-point, defaults to the
 * center of the view-box.
 */
xrx.drawing.ViewboxZoom.prototype.zoomIn = function(opt_fixPoint) {
  this.zoomTo(this.zoomValue_ + this.zoomFactor_, opt_fixPoint);
};



/**
 * Zoom out the view-box, optionally respecting a fix-point.
 * @param {?Array.<number>} opt_fixPoint A fix-point, defaults to the
 * center of the view-box.
 */
xrx.drawing.ViewboxZoom.prototype.zoomOut = function(opt_fixPoint) {
  this.zoomTo(this.zoomValue_ - this.zoomFactor_, opt_fixPoint);
};

/**
 * @fileoverview A class implementing transformation related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxTransform');



goog.require('xrx.drawing.FastAffineTransform');
goog.require('xrx.drawing.Orientation');
goog.require('xrx.drawing.ViewboxTranslate');



xrx.drawing.ViewboxTransform = function() {

  this.ctm_ = new xrx.drawing.FastAffineTransform();

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxTransform, xrx.drawing.ViewboxTranslate);



/**
 * Returns the current transformation matrix of the view-box.
 * @return {goog.math.affineTransform} The transformation matrix.
 */
xrx.drawing.ViewboxTransform.prototype.getCTM = function() {
  return this.ctm_;
};



/**
 * Sets the current transformation matrix of the view-box.
 * @param {goog.math.affineTransform} ctm The matrix object.
 */
xrx.drawing.ViewboxTransform.prototype.setCTM = function(ctm) {
  this.ctm_ = ctm;
};



/**
 * Returns a dump of the current CTM as an array.
 * @return Array<number> The number array.
 */
xrx.drawing.ViewboxTransform.prototype.ctmDump = function() {
  return [this.ctm_.m00_, this.ctm_.m10_, this.ctm_.m01_,
      this.ctm_.m11_, this.ctm_.m02_, this.ctm_.m12_];
};



/**
 * Restores a CTM from an array.
 * @param Array<number> dump The number array.
 */
xrx.drawing.ViewboxTransform.prototype.ctmRestore = function(dump) {
  if (dump.length !== 6) throw Error('Invalid CTM dump.');
  this.ctm_.setTransform(dump[0], dump[1], dump[2], dump[3],
      dump[4], dump[5]);
};



/**
 * Makes the whole view-box width visible.
 * @deprecated
 */
xrx.drawing.ViewboxTransform.prototype.setOptimalWidth = function() {
  var canvasWidth = this.drawing_.getCanvas().getWidth();
  var imageWidth = this.drawing_.getLayerBackground().getImage().getWidth();
  var scale = canvasWidth / imageWidth;
  this.ctm_.scale(scale, scale);
};



/**
 * Makes the whole view-box height visible.
 * @deprecated
 */
xrx.drawing.ViewboxTransform.prototype.setOptimalHeight = function() {
  var canvasHeight = this.drawing_.getCanvas().getHeight();
  var imageHeight = this.drawing_.getLayerBackground().getImage().getHeight();
  var scale = canvasHeight / imageHeight;
  this.ctm_.scale(scale, scale);
};



xrx.drawing.ViewboxTransform.prototype.fitToWidth = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasWidth = this.drawing_.getCanvas().getWidth();
  var scale = canvasWidth / image.getWidth();
  var tmp = this.ctm_.getRotation(); // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.Orientation.NW);
  this.zoom(scale, xrx.drawing.Orientation.NW);
};



xrx.drawing.ViewboxTransform.prototype.fitToHeight = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
	var canvasHeight = this.drawing_.getCanvas().getHeight();
  var scale = canvasHeight / image.getHeight();
  var tmp = this.ctm_.getRotation(); // we want to keep the rotation

  this.resetTransform_();
  this.rotate(tmp, xrx.drawing.Orientation.NW);
  this.zoom(scale, xrx.drawing.Orientation.NW);
};



xrx.drawing.ViewboxTransform.prototype.fit = function() {
};



/**
 * @private
 */
xrx.drawing.ViewboxTransform.prototype.resetTransform_ = function() {
  this.ctm_.setTransform(1, 0, 0, 1, 0, 0);
};



/**
 * @private
 */
xrx.drawing.ViewboxTransform.prototype.getOffsetTranslate_ = function(scale, fixPoint) {
  var at = this.ctm_.clone();
  at.rotate(goog.math.toRadians(-this.ctm_.getRotation()), 0, 0);
  var scl = at.getScaleX();
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth() * scl;
  var height = image.getHeight() * scl;
  var offset = {
    0: [0, 0],
    1: [0, -(height * scale - height)],
    2: [0, 0],
    3: [0, -(scale * height - height)]
  };
  var off = offset[this.getDirection_()];
  return {x: off[0], y: off[1]};
};

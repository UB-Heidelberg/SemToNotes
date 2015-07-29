/**
 * @fileoverview A class providing optimizations and extensions for
 * class goog.math.AffineTransform, e.g., to avoid object allocations.
 */

goog.provide('xrx.drawing.FastAffineTransform');



goog.require('goog.math');
goog.require('goog.math.AffineTransform');



/**
 * @constructor
 */
xrx.drawing.FastAffineTransform = function() {

  goog.base(this);
 
  this.identity_;

  this.inverse_;
};
goog.inherits(xrx.drawing.FastAffineTransform, goog.math.AffineTransform);



xrx.drawing.FastAffineTransform.prototype.getIdentity = function() {
  if (!this.identity_) this.identity_ = new xrx.drawing.FastAffineTransform();
  this.identity_.setTransform(1, 0, 0, 1, 0, 0);
  return this.identity_;
};



xrx.drawing.FastAffineTransform.prototype.getInverse = function() {
  if (!this.inverse_) this.inverse_ = new xrx.drawing.FastAffineTransform();
  var det = this.getDeterminant();
  this.inverse_.setTransform(
    this.m11_ / det,
    -this.m10_ / det,
    -this.m01_ / det,
    this.m00_ / det,
    (this.m01_ * this.m12_ - this.m11_ * this.m02_) / det,
    (this.m10_ * this.m02_ - this.m00_ * this.m12_) / det
  );
  return this.inverse_;
};



xrx.drawing.FastAffineTransform.prototype.transformPoint = function(point, opt_newPoint) {
  var p = opt_newPoint ? opt_newPoint : new Array(2);
  this.createInverse().transform(point, 0, p, 0, 1);
  return p;
};



xrx.drawing.FastAffineTransform.prototype.getZoomValue = function() {
  var scaleX = this.getScaleX();
  var shearX = this.getShearX();
  var value = Math.sqrt(scaleX * scaleX + shearX * shearX);
  return parseFloat(value.toFixed(2));
};



xrx.drawing.FastAffineTransform.prototype.getRotation = function() {
  var atan = Math.round(Math.atan2(this.getShearY(), this.getScaleY()));
  var toDegree = {
    '0': 0,
    '2': 90,
    '3': 180,
    '-2': 270
  }
  return toDegree[atan]; 
};

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

  this.clone_;
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



xrx.drawing.FastAffineTransform.prototype.getClone = function() {
  if (!this.clone_) this.clone_ = new xrx.drawing.FastAffineTransform();
  return this.clone_.copyFrom(this);
};



xrx.drawing.FastAffineTransform.prototype.transformPoint = function(point, opt_targetPoint) {
  var p = opt_targetPoint !== undefined ? opt_targetPoint : new Array(2);
  this.createInverse().transform(point, 0, p, 0, 1);
  return p;
};



xrx.drawing.FastAffineTransform.prototype.getScale = function() {
  var rotation = this.getRotation();
  this.getClone().rotate(goog.math.toRadians(360 - rotation));
  return this.clone_.getScaleX();
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

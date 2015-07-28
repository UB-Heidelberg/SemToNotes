/**
 * @fileoverview A class implementing optimizations for fast
 * affine transformation.
 */

goog.provide('xrx.drawing.FastAffineTransform');



goog.require('goog.math.AffineTransform');



/**
 * @constructor
 */
xrx.drawing.FastAffineTransform = function() {

  goog.base(this);

  this.identity_;
};
goog.inherits(xrx.drawing.FastAffineTransform, goog.math.AffineTransform);



xrx.drawing.FastAffineTransform.prototype.getIdentity = function() {
  if (!this.identity_) this.identity_ = new xrx.drawing.FastAffineTransform();
  this.identity_.setTransform(1, 0, 0, 1, 0, 0);
  return this.identity_;
};



xrx.drawing.FastAffineTransform.prototype.transformPoint = function(point, opt_newPoint) {
  var p = opt_newPoint ? opt_newPoint : new Array(2);
  this.createInverse().transform(point, 0, p, 0, 1);
  return p;
};

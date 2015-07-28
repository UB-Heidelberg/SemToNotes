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
};
goog.inherits(xrx.drawing.FastAffineTransform, goog.math.AffineTransform);

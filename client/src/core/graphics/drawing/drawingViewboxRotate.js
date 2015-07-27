/**
 * @fileoverview A class implementing the rotation model for
 * a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxRotate');



goog.require('xrx.drawing.ViewboxGeometry');



xrx.drawing.ViewboxRotate = function() {

  this.rotation_ = 0;

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxRotate, xrx.drawing.ViewboxGeometry);



/**
 * Rotates the view-box by an angle, respecting a fix-point.
 * @param {number?} opt_angle The angle of rotation, e.g. -40. Defaults
 *     to 90.
 * @param {enum?} opt_fixPoint The fix-point. Defaults to
 *     xrx.drawing.ViewboxGeometry.FixPoint.C.
 */
xrx.drawing.ViewboxRotate.prototype.rotate = function(opt_angle, opt_fixPoint) {
  var fixPoint;
  var point;
  var angle;

  opt_angle === undefined ? angle = 90 : angle = opt_angle;
  opt_fixPoint === undefined ? fixPoint = xrx.drawing.ViewboxGeometry.FixPoint.C :
      fixPoint = opt_fixPoint;
  point = this.getAnchorPoint_(fixPoint);

  this.ctm_.rotate(goog.math.toRadians(angle), point[0], point[1]);
  this.rotation_ += angle;
  // keep rotation a positive number between 0° and 360°
  this.rotation_ = (this.rotation_ + 360) % 360;
  if (this.drawing_.eventViewboxChange) this.drawing_.eventViewboxChange(); 
};



/**
 * Rotates the view-box by 90° in left direction.
 */
xrx.drawing.ViewboxRotate.prototype.rotateLeft = function() {
  this.rotate(-90, xrx.drawing.ViewboxGeometry.FixPoint.C);
};



/**
 * Rotates the view-box by 90° in right direction.
 */
xrx.drawing.ViewboxRotate.prototype.rotateRight = function() {
  this.rotate(90, xrx.drawing.ViewboxGeometry.FixPoint.C);
};

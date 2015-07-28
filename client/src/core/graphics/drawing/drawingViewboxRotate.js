/**
 * @fileoverview A class implementing the rotation model for
 * a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxRotate');



goog.require('xrx.drawing.FixPoint');
goog.require('xrx.drawing.ViewboxGeometry');



/**
 * A class implementing the rotation model for a drawing view-box.
 * @constructor
 */
xrx.drawing.ViewboxRotate = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxRotate, xrx.drawing.ViewboxGeometry);



/**
 * The current rotation in degrees. The view-box expects
 * the rotation to be 0, 90, 180 or 270. Other values are
 * not supported and may lead to unexpected behavior.
 * @type {number}
 */
xrx.drawing.ViewboxRotate.prototype.rotation_ = 0;



/**
 * Returns the current rotation in degrees.
 * @return {number} The current rotation in degrees.
 */
xrx.drawing.ViewboxRotate.prototype.getRotation = function() {
  return this.rotation_;
};



/**
 * Check whether the rotation value is valid.
 * @param {number} rotation The rotation in degrees.
 * @return {boolean} Whether the rotation is valid.
 */
xrx.drawing.ViewboxRotate.prototype.isValidRotation = function(rotation) {
  var abs = Math.abs(rotation);
  return abs === 0 || abs === 90 || abs === 180 || abs === 270;
};



/**
 * Whether the the view-box currently is in vertical orientation.
 * @return {boolean} Whether the view-box is oriented vertically.
 */
xrx.drawing.ViewboxRotate.prototype.isVertical = function() {
  return this.rotation_ === 0 || this.rotation_ === 180;
};



/**
 * Whether the the view-box currently is in horizontal orientation.
 * @return {boolean} Whether the view-box is oriented horizontally.
 */
xrx.drawing.ViewboxRotate.prototype.isHorizontal = function() {
  return this.rotation_ === 90 || this.rotation_ === 270;
};



/**
 * Enumeration of view-box orientations.
 * @enum {number}
 * @private
 */
xrx.drawing.ViewboxRotate.Orientation_ = {
  '0':    0,
  '90':   1,
  '180':  2,
  '270':  3
};



/**
 * Returns the current orientation of the view-box.
 * @return {number} The orientation.
 * @private
 */
xrx.drawing.ViewboxRotate.prototype.orientation_ = function() {
  return xrx.drawing.ViewboxRotate.Orientation_[parseInt(this.rotation_)];
};



/**
 * Rotates the view-box by an angle, respecting a fix-point.
 * @param {number?} angle The angle of rotation, e.g. 90 or 180.
 * @param {enum?} opt_fixPoint A fix-point. Defaults to the center
 * of the view-box ().
 */
xrx.drawing.ViewboxRotate.prototype.rotateBy = function(angle, opt_fixPoint) {
  if (!this.isValidRotation(angle))
      throw Error('Invalid rotation. 0, 90, 180 or 270 expected.');
  var fixPoint;
  var point;

  opt_fixPoint === undefined ? fixPoint = xrx.drawing.FixPoint.C :
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
xrx.drawing.ViewboxRotate.prototype.rotateLeft = function(opt_fixPoint) {
  this.rotateBy(-90, xrx.drawing.FixPoint.C);
};



/**
 * Rotates the view-box by 90° in right direction.
 */
xrx.drawing.ViewboxRotate.prototype.rotateRight = function(opt_fixPoint) {
  this.rotateBy(90, xrx.drawing.FixPoint.C);
};



/**
 * @private
 */
xrx.drawing.ViewboxRotate.prototype.getAnchorPoints_ = function() {
  var width = this.getWidth();
  var height = this.getHeight();
  return {
    0: [width / 2, width / 2], // north
    1: [height / 2, height / 2], // east 
    2: [width / 2, width / 2 + height / 2], // south
    3: [-height / 2 + width, height / 2] // west
  };
};



/**
 * @private
 */
xrx.drawing.ViewboxRotate.prototype.getAnchorPoint_ = function(fixPoint,
    reverse, opt_transformed) {
  var anchorPoints = this.getAnchorPoints_();
  var point = {
    'C': function(ap, vb) {
      return vb.getCenterPoint_();
    },
    'NE': function(ap, vb) {
      var order = [0, 1, 2, 3];
      return ap[order[vb.orientation_()]];
    },
    'SE': function(ap, vb) {
      var order = [3, 0, 1, 2];
      return ap[order[vb.orientation_()]];
    },
    'SW': function(ap, vb) {
      var order = [2, 3, 0, 1];
      return ap[order[vb.orientation_()]];
    },
    'NW': function(ap, vb) {
      var order = [1, 2, 3, 0];
      return ap[order[vb.orientation_()]];
    }
  };
  return point[fixPoint](anchorPoints, this);
};

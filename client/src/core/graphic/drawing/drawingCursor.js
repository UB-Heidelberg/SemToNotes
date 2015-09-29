/**
 * @fileoverview A class offering configurable information
 * about the mouse, respectively, the touch point.
 */

goog.provide('xrx.drawing.Cursor');



xrx.drawing.Cursor = function(drawing) {

  this.drawing_ = drawing;

  this.needPoint_ = false;

  this.point = null;

  this.needPointTransformed_ = false;

  this.pointTransformed_ = null;

  this.needShape_ = false;

  this.shape_ = null;

  this.needShapes_ = false;

  this.shapes_ = null;
};



xrx.drawing.Cursor.prototype.getPoint = function() {
  return this.point_;
};



xrx.drawing.Cursor.prototype.getPointTransformed = function() {
  return this.pointTransformed_;
};



xrx.drawing.Cursor.prototype.getShape = function() {
  return this.shape_;
};



xrx.drawing.Cursor.prototype.getShapes = function() {
  return this.shapes_;
};



xrx.drawing.Cursor.prototype.reset = function() {
  this.needPoint_ = false;
  this.needPointTransformed_ = false;
  this.needShape_ = false;
  this.needShapes_ = false;
};



xrx.drawing.Cursor.prototype.needPoint = function() {
  this.needPoint_ = true;
};



xrx.drawing.Cursor.prototype.needPointTransformed = function() {
  this.needPointTransformed_ = true;
};



xrx.drawing.Cursor.prototype.needShape = function() {
  this.needShape_ = true;
};



xrx.drawing.Cursor.prototype.needShapes = function() {
  this.needShapes_ = true;
};



/**
 * @private
 */
xrx.drawing.Cursor.prototype.calculatePoint_ = function(e) {
  this.needPoint_ ? this.point_ = this.drawing_.getOffsetPoint(e) :
      this.point_ = null;
};



/**
 * @private
 */
xrx.drawing.Cursor.prototype.calculatePointTransformed_ = function(e) {
  if (this.point_ === null) this.calculatePoint_(e);
  this.needPointTransformed_ ? this.pointTransformed_ =
      this.drawing_.getViewbox().getCTM().transformPoint(this.point_) :
      this.pointTransformed_ = null;
};



/**
 * @private
 */
xrx.drawing.Cursor.prototype.calculateShape_ = function(e) {
  if (this.pointTransformed_ === null) this.calculatePointTransformed_(e);
  this.needShape_ ? this.shape_ = this.drawing_.getShapeSelected(this.pointTransformed_) :
      this.shape_ = null;
};



/**
 * @private
 */
xrx.drawing.Cursor.prototype.calculateShapes_ = function(e) {
  if (this.pointTransformed_ === null) this.calculatePointTransformed_(e);
  this.needShapes_ ? this.shapes_ = this.drawing_.getShapesSelected(this.pointTransformed_) :
      this.shapes_ = null;
};



/**
 * Calculates cursor information as configured.
 */
xrx.drawing.Cursor.prototype.calculate = function(e) {
  this.calculatePoint_(e);
  this.calculatePointTransformed_(e);
  this.calculateShape_(e);
  this.calculateShapes_(e);
};

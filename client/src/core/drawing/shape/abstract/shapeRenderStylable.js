/**
 * @fileoverview A class implementing dynamic rendering of shapes.
 * @private
 */

goog.provide('xrx.shape.RenderStylable');



goog.require('xrx.shape.Style');



/**
 * A class implementing dynamic rendering of shapes.
 * @constructor
 * @extends {xrx.shape.Style}
 * @private
 */
xrx.shape.RenderStylable = function() {

  goog.base(this);

  /**
   * The current zoom factor to realize constant
   * line width and constant size of dragging elements.
   * @type {number}
   */
  this.zoomFactor_ = 1;

  /**
   * The shape group, if the shape belongs to a group.
   * @type {xrx.shape.ShapeGroup}
   */
  this.shapeGroup_;
};
goog.inherits(xrx.shape.RenderStylable, xrx.shape.Style);



/**
 * Returns the current shape group.
 * @return {xrx.shape.ShapeGroup} The shape group.
 * @private
 */
xrx.shape.RenderStylable.prototype.getShapeGroup = function() {
  return this.shapeGroup_;
};



/**
 * Sets this shape to be part of a shape group.
 * @param {xrx.shape.ShapeGroup} shapeGroup The shape group.
 * @private
 */
xrx.shape.RenderStylable.prototype.setShapeGroup = function(shapeGroup) {
  this.shapeGroup_ = shapeGroup;
};



/**
 * Returns the underlying engine element.
 * @return {xrx.engine.Element} The engine element.
 */
xrx.shape.RenderStylable.prototype.getEngineElement = function() {
  return this.engineElement_;
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.setZoomFactor = function(factor) {
  this.zoomFactor_ = factor;
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.getRenderingFillColor = function() {
  return this.shapeGroup_ ? this.shapeGroup_.getFillColor() :
      this.fill_.color;
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.getRenderingFillOpacity = function() {
  return this.shapeGroup_ ? this.shapeGroup_.getFillOpacity() :
      this.fill_.opacity;
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.getRenderingStrokeColor = function() {
  return this.shapeGroup_ ? this.shapeGroup_.getStrokeColor() :
      this.stroke_.color;
};



/**
 * Returns the stroke width of this shape.
 * @return {number} The stroke width.
 */
xrx.shape.RenderStylable.prototype.getRenderingStrokeWidth = function() {
  return this.shapeGroup_ ? this.shapeGroup_.getStrokeWidth() / this.zoomFactor_ :
      this.stroke_.width / this.zoomFactor_;
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.startDrawing_ = function() {
  this.drawing_.eventBeforeRendering(this);
  this.engineElement_.applyTransform(this.ctm_);
  this.engineElement_.startDrawing();
};



/**
 * @private
 */
xrx.shape.RenderStylable.prototype.finishDrawing_ = function() {
  this.engineElement_.finishDrawing();
};



xrx.shape.RenderStylable.prototype.disposeInternal = function() {
  this.engineElement_.dispose();
  this.engineElement_ = null;
  goog.dispose(this.shapeGroup_);
  this.shapeGroup_ = null;
  goog.base(this, 'disposeInternal');
};

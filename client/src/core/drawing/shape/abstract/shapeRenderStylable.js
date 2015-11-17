/**
 * @fileoverview A class implementing dynamic rendering of shapes.
 * @private
 */

goog.provide('xrx.shape.RenderStylable');



goog.require('xrx.shape.Stylable');



/**
 * A class implementing dynamic rendering of shapes.
 * @constructor
 * @private
 */
xrx.shape.RenderStylable = function() {

  goog.base(this);

  /**
   * @type {number}
   */
  this.zoomFactor_ = 1;
};
goog.inherits(xrx.shape.RenderStylable, xrx.shape.Stylable);



/**
 * Returns the underlying engine element.
 * @return {xrx.engine.Element} The engine element.
 */
xrx.shape.RenderStylable.prototype.getEngineElement = function() {
  return this.engineElement_;
};



xrx.shape.RenderStylable.prototype.setZoomFactor = function(factor) {
  this.zoomFactor_ = factor;
};



/**
 * Returns the stroke width of this shape.
 * @return {number} The stroke width.
 */
xrx.shape.RenderStylable.prototype.getRenderingStrokeWidth = function() {
  return this.stroke_.width / this.zoomFactor_;
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
  goog.base(this, 'disposeInternal');
};

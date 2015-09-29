/**
 * @fileoverview An abstract class representing the geometry
 * of a shape.
 */

goog.provide('xrx.shape.Geometry');



goog.require('xrx.shape.Shape');



xrx.shape.Geometry = function(drawing, engineElement, geometry) {

  goog.base(this, drawing, engineElement);

  /**
   * Object describing the geometry of this shape.
   * @type {xrx.geometry.Geometry}
   */
  this.geometry_ = geometry;

  /**
   * The current zoom factor that, e.g., influences stroke width.
   * @type {number}
   */
  this.zoomFactor_ = 1;

  /**
   * The current transformation matrix of this shape.
   * @type {goog.math.AffineTransform}
   */
  this.ctm_;
};
goog.inherits(xrx.shape.Geometry, xrx.shape.Shape);



/**
 * Sets the current zoom factor, useful to realize shapes with constant
 * size or constant stroke width.
 * @param {number} factor The zoom factor.
 */
xrx.shape.Geometry.prototype.setZoomFactor = function(factor) {
  this.zoomFactor_ = factor;
};



/**
 * Returns the geometry object of this shape.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.shape.Geometry.prototype.getGeometry = function() {
  return this.geometry_;
};


/**
 * Sets a transformation matrix for this shape.
 * @param {goog.math.AffineTransform} matrix The matrix.
 */
xrx.shape.Geometry.prototype.setCTM = function(matrix) {
  this.ctm_ = matrix;
};

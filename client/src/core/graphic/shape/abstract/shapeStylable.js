/**
 * @fileoverview An abstract class describing style information for shapes.
 */

goog.provide('xrx.shape.Stylable');



goog.require('xrx.shape');



/**
 * A class describing style information for shapes.
 * @constructor
 * @private
 */
xrx.shape.Stylable = function() {

  /**
   * Object describing the fill style.
   */
  this.fill_ = {
    color: '',
    opacity: 0
  };

  /**
   * Object describing the stroke style.
   */
  this.stroke_ = {
    color: 'black',
    width: 1
  };
};



/**
 * Sets a stylable object for this shape.
 * @param {xrx.shape.Style} style 
 */
xrx.shape.Stylable.prototype.setStyle = function(stylable) {
  this.stroke_.color = stylable.getStrokeColor();
  this.stroke_.width = stylable.getStrokeWidth();
  this.fill_.color = stylable.getFillColor();
  this.fill_.opacity = stylable.getFillOpacity();
};



/**
 * Returns the stroke width of this shape.
 * @return {number} The stroke width.
 */
xrx.shape.Stylable.prototype.getStrokeWidth = function() {
  return this.stroke_.width;
};



/**
 * Sets the stroke width of this shape.
 * @param {number} width The stroke width.
 */
xrx.shape.Stylable.prototype.setStrokeWidth = function(width) {
  if (width !== undefined) this.stroke_.width = width;
};



/**
 * Returns the stroke color of this shape.
 * @return {string} The stroke color.
 */
xrx.shape.Stylable.prototype.getStrokeColor = function() {
  return this.stroke_.color;
};



/**
 * Sets the stroke color of this shape.
 * @param {string} color The stroke color.
 */
xrx.shape.Stylable.prototype.setStrokeColor = function(color) {
  if (color !== undefined) this.stroke_.color = color;
};



/**
 * Returns the fill color of this shape.
 * @return {string} The fill color.
 */
xrx.shape.Stylable.prototype.getFillColor = function() {
  return this.fill_.color;
};



/**
 * Sets the fill color of this shape.
 * @param {string} color The fill color.
 */
xrx.shape.Stylable.prototype.setFillColor = function(color) {
  if (this.fill_.opacity === 0) this.fill_.opacity = 1;
  if (color !== undefined) this.fill_.color = color;
};



/**
 * Returns the fill opacity of this shape.
 * @return {number} The fill opacity.
 */
xrx.shape.Stylable.prototype.getFillOpacity = function() {
  return this.fill_.opacity;
};



/**
 * Sets the fill opacity of this shape.
 * @param {number} factor The fill opacity.
 */
xrx.shape.Stylable.prototype.setFillOpacity = function(factor) {
  if (factor !== undefined) this.fill_.opacity = factor;
};

/**
 * @fileoverview An abstract class describing style information for shapes.
 */

goog.provide('xrx.engine.Stylable');



/**
 * @constructor
 */
xrx.engine.Stylable = function() {

  /**
   * Object describing the stroke style.
   */
  this.stroke_ = {
    color: 'black',
    width: 1
  };

  /**
   * Object describing the fill style.
   */
  this.fill_ = {
    color: '',
    opacity: 0
  };
};



/**
 * Sets all stylable parameters at once from another stylable object.
 * @param {xrx.engine.Stylable} stylable 
 */
xrx.engine.Stylable.prototype.setAll = function(stylable) {
  this.stroke_.color = stylable.getStrokeColor();
  this.stroke_.width = stylable.getStrokeWidth();
  this.fill_.color = stylable.getFillColor();
  this.fill_.opacity = stylable.getFillOpacity();
};



/**
 * Returns the stroke width of the stylable element.
 * @return {number} The stroke width.
 */
xrx.engine.Stylable.prototype.getStrokeWidth = function() {
  return this.stroke_.width;
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.engine.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width || this.stroke_.width;
};



/**
 * Returns the stroke color of the stylable element.
 * @return {string} The stroke color.
 */
xrx.engine.Stylable.prototype.getStrokeColor = function() {
  return this.stroke_.color;
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.engine.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color || this.stroke_.color;
};



/**
 * Returns the fill color of the stylable element.
 * @return {string} The fill color.
 */
xrx.engine.Stylable.prototype.getFillColor = function() {
  return this.fill_.color;
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.engine.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color || this.fill_.color;
};



/**
 * Returns the fill opacity of the stylable element.
 * @return {number} The fill opacity.
 */
xrx.engine.Stylable.prototype.getFillOpacity = function() {
  return this.fill_.opacity;
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.engine.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor || this.fill_.opacity;
};

/**
 * @fileoverview An abstract class describing style information for
 * graphics.
 */

goog.provide('xrx.graphic.Style');



/**
 * An abstract class describing style information for
 * graphics.
 * @constructor
 */
xrx.graphic.Style = function() {

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



xrx.graphic.Style.prototype.getFillColor = function() {
  return this.fill_.color;
};



xrx.graphic.Style.prototype.setFillColor = function(color) {
  this.fill_.color = color;
};



xrx.graphic.Style.prototype.getFillOpacity = function() {
  return this.fill_.opacity;
};



xrx.graphic.Style.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
};



xrx.graphic.Style.prototype.getStrokeColor = function() {
  return this.stroke_.color;
};



xrx.graphic.Style.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
};



xrx.graphic.Style.prototype.getStrokeWidth = function() {
  return this.stroke_.width;
};



xrx.graphic.Style.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
};

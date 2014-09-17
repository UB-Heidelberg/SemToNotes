/**
 * @fileoverview Canvas class representing a stylable element.
 */

goog.provide('xrx.canvas.Stylable');



goog.require('xrx.canvas.Element');



/**
 * Canvas class representing a stylable element.
 * @param {HTMLCanvasElement} canvas The parent canvas element.
 * @param {xrx.geometry.Geometry} geometry A geometry object.
 * @constructor
 * @extends {xrx.canvas.Element}
 */
xrx.canvas.Stylable = function(canvas, geometry) {

  goog.base(this, canvas);

  /**
   * Object describing the geometry of the stylable element.
   * @type {xrx.geometry.Geometry}
   */
  this.geometry_ = geometry;

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
    color: 'black',
    opacity: 1
  };
};
goog.inherits(xrx.canvas.Stylable, xrx.canvas.Element);



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.canvas.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.canvas.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.canvas.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {string} factor The fill opacity.
 */
xrx.canvas.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
};


/**
 * @private
 */
xrx.canvas.Stylable.prototype.strokeAndFill_ = function() {
  this.context_.fillStyle = this.fill_.color;
  this.context_.globalAlpha = this.fill_.opacity;
  this.context_.fill();
  this.context_.globalAlpha = 1;
  this.context_.strokeStyle = this.stroke_.color;
  this.context_.lineWidth = this.stroke_.width;
  if (this.stroke_.width > 0) this.context_.stroke();
};

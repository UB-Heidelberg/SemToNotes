/**
 * @fileoverview Canvas class representing a stylable element.
 */

goog.provide('xrx.cnvs.Stylable');



goog.require('xrx.cnvs.Element');
goog.require('xrx.engine');
goog.require('xrx.engine.Stylable');



/**
 * Canvas class representing a stylable element.
 * @param {HTMLCanvasElement} canvas The parent canvas element.
 * @param {xrx.geometry.Geometry} geometry A geometry object.
 * @constructor
 * @extends {xrx.cnvs.Element}
 */
xrx.cnvs.Stylable = function(canvas, geometry) {

  goog.base(this, canvas);

  /**
   * Object describing the geometry of the stylable element.
   * @type {xrx.geometry.Geometry}
   */
  this.geometry_ = geometry;

  /**
   * Object describing the style of the stylable element.
   * @type {xrx.engine.Stylable}
   * @private
   */
  this.stylable_ = new xrx.engine.Stylable();
};
goog.inherits(xrx.cnvs.Stylable, xrx.cnvs.Element);



/**
 * Returns the geometry object of the stylable element.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.cnvs.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
};



/**
 * Returns the style object of the stylable element.
 * @return {xrx.engine.Stylable} The style object.
 */
xrx.cnvs.Stylable.prototype.getStylable = function() {
  return this.stylable_;
};



/**
 * Sets all styles at once by overloading a stylable object.
 * @param {xrx.engine.Stylable} stylable The stylable object.
 */
xrx.cnvs.Stylable.prototype.setStylable = function(stylable) {
  this.stylable_.setAll(stylable);
  this.strokeAndFill_();
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.cnvs.Stylable.prototype.setStrokeWidth = function(width) {
  this.stylable_.setStrokeWidth(width);
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.cnvs.Stylable.prototype.setStrokeColor = function(color) {
  this.stylable_.setStrokeColor(color);
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.cnvs.Stylable.prototype.setFillColor = function(color) {
  this.stylable_.setFillColor(color);
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.cnvs.Stylable.prototype.setFillOpacity = function(factor) {
  this.stylable_.setFillOpacity(factor);
};


/**
 * @private
 */
xrx.cnvs.Stylable.prototype.strokeAndFill_ = function() {
  this.context_.fillStyle = this.stylable_.getFillColor();
  this.context_.globalAlpha = this.stylable_.getFillOpacity();
  this.context_.fill();
  this.context_.globalAlpha = 1;
  this.context_.strokeStyle = this.stylable_.getStrokeColor();
  this.context_.lineWidth = this.stylable_.getStrokeWidth();
  if (this.stylable_.getStrokeWidth() > 0) this.context_.stroke();
};

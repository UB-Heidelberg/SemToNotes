/**
 * @fileoverview SVG class representing a stylable element.
 */

goog.provide('xrx.svg.Stylable');



goog.require('xrx.svg.Element');
goog.require('xrx.engine');
goog.require('xrx.engine.Stylable');



/**
 * SVG class representing a stylable element.
 * @param {SVGElement} element A SVG element.
 * @param {xrx.geometry.Geometry} geometry A geometry object.
 * @constructor
 * @extends {xrx.svg.Element}
 */
xrx.svg.Stylable = function(element, geometry) {

  goog.base(this, element);

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
goog.inherits(xrx.svg.Stylable, xrx.svg.Element);



/**
 * Returns the geometry object of the stylable element.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.svg.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
};



/**
 * Returns the style object of the stylable element.
 * @return {xrx.engine.Stylable} The style object.
 */
xrx.svg.Stylable.prototype.getStylable = function() {
  return this.stylable_;
};



/**
 * Sets all styles at once by overloading a stylable object.
 * @param {xrx.engine.Stylable} stylable The stylable object.
 */
xrx.svg.Stylable.prototype.setStylable = function(stylable) {
  this.stylable_.setAll(stylable);
  this.setStrokeWidth(stylable.getStrokeWidth());
  this.setStrokeColor(stylable.getStrokeColor());
  this.setFillColor(stylable.getFillColor());
  this.setFillOpacity(stylable.getFillOpacity());
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.svg.Stylable.prototype.setStrokeWidth = function(width) {
  this.stylable_.setStrokeWidth(width);
  this.element_.setAttribute('stroke-width', this.stylable_.getStrokeWidth());
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.svg.Stylable.prototype.setStrokeColor = function(color) {
  this.stylable_.setStrokeColor(color);
  this.element_.setAttribute('stroke', this.stylable_.getStrokeColor());
  this.element_.setAttribute('stroke-color', this.stylable_.getStrokeColor());
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.svg.Stylable.prototype.setFillColor = function(color) {
  this.stylable_.setFillColor(color);
  this.element_.setAttribute('fill', this.stylable_.getFillColor());
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.svg.Stylable.prototype.setFillOpacity = function(factor) {
  this.stylable_.setFillOpacity(factor);
  this.element_.setAttribute('fill-opacity', this.stylable_.getFillOpacity());
};

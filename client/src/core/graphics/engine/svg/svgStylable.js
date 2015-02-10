/**
 * @fileoverview SVG class representing a stylable element.
 */

goog.provide('xrx.svg.Stylable');



goog.require('xrx.svg.Element');



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
goog.inherits(xrx.svg.Stylable, xrx.svg.Element);



/**
 * Returns the geometry object of the stylable element.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.svg.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.svg.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width || this.stroke_.width;
  this.element_.setAttribute('stroke-width', this.stroke_.width);
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.svg.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color || this.stroke_.color;
  this.element_.setAttribute('stroke', this.stroke_.color);
  this.element_.setAttribute('stroke-color', this.stroke_.color);
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.svg.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color || this.fill_.color;
  this.element_.setAttribute('fill', this.fill_.color);
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {string} factor The fill opacity.
 */
xrx.svg.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor || this.fill_.opacity;
  this.element_.setAttribute('fill-opacity', this.fill_.opacity);
};
